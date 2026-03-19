---
name: scalable-image-management
description: >
  **WORKFLOW SKILL** — Production-grade architecture for managing large photography
  portfolios (100–2000+ images) in React + Vite. Covers folder structure, Vite
  imagetools pipeline, responsive srcSet generation, component hierarchy, SEO,
  performance budgets, print sales UX, and deployment. USE FOR: bootstrapping new
  gallery sections, adding image categories, optimizing existing photo pages,
  auditing performance, and scaling from tens to thousands of images. NOT FOR:
  general React component questions or non-image features.
---

# Scalable Image Management Architecture in React + Vite

## 1. Purpose

- Codify a **repeatable, production-level system** for managing large photography portfolios inside a React + Vite SPA.
- This is a **reusable personal architecture pattern** — not a one-off project scaffold. Apply it to any portfolio, client-gallery, or sports-photography site that shares the same performance, SEO, and print-sales constraints.
- Primary success criteria: sub-2s LCP on 3G, zero CLS, ADA-compliant alt text, and a clear print-purchase conversion funnel.

---

## 2. System Architecture

### 2.1 Folder Structure

```
src/
  assets/
    photos/                       # Web-optimized originals (JPEGs committed to repo)
      {category}/                 # e.g. bandits/, youth/, portraits/
        IMG_{ID}-web-watermarked-2.jpg
  data/
    gallery.json                  # Metadata manifest (see §2.3)
  molecules/
    PhotoCard/                    # Single image display unit
  organisms/
    PhotoModal/                   # Lightbox / carousel overlay
  pages/
    Photos/                       # Gallery entry point
scripts/
  optimize-images.mjs            # CLI batch pipeline (see §3.7)
```

- **One category = one subfolder.** Flat files in `photos/` are uncategorized featured shots.
- Watermarked web exports live in the repo; RAW/full-res masters live **outside** the repo (NAS, cloud bucket, or LFS).

### 2.2 Image Storage Strategy

| Tier                | Location                                | Purpose                           |
| ------------------- | --------------------------------------- | --------------------------------- |
| RAW / Full-res      | External (S3, NAS, Lightroom catalog)   | Archival, print fulfillment       |
| Web master          | `src/assets/photos/{category}/`         | Source-of-truth for Vite pipeline |
| Responsive variants | Generated at build by `vite-imagetools` | Served to browser via srcSet      |
| Thumbnails          | Generated at build (≤ 480 w)            | Grid previews, LQIP               |

- Never commit RAW files or uncompressed TIFFs.
- Watermarked copies protect against unauthorized use while allowing full-quality srcSet generation.

### 2.3 Metadata Management

Metadata can live in one of two tiers depending on scale:

**Tier A — Static JSON (≤ 500 images)**

```jsonc
// src/data/gallery.json
[
  {
    "id": "IMG_4725",
    "category": "bandits",
    "file": "IMG_4725-web-watermarked-2.jpg",
    "alt": "Midfielder controlling the ball during a Bandits FC night match under stadium lights",
    "width": 2000,
    "height": 1333,
    "tags": ["action", "night", "midfield"],
    "printAvailable": true,
  },
]
```

**Tier B — Headless CMS (500+ images)**

- Sanity, Strapi, or Contentful.
- Query at build time via `vite-plugin-ssr` or at runtime via API with SWR/React Query.

### 2.4 Dynamic Imports with Vite

**Current pattern — explicit imports with `vite-imagetools` query strings:**

```ts
// Fallback src
import img4725 from '../../assets/photos/bandits/IMG_4725-web-watermarked-2.jpg';
// Responsive srcSet  (480, 768, 1024, 2000 px widths, JPEG output)
import img4725SrcSet from '../../assets/photos/bandits/IMG_4725-web-watermarked-2.jpg?w=480;768;1024;2000&format=jpg&as=srcset';
```

**Scaled pattern — `import.meta.glob` for 100+ images:**

```ts
const images = import.meta.glob<{ default: string }>(
  '../../assets/photos/**/*.jpg',
  { eager: false },
);

const srcSets = import.meta.glob<{ default: string }>(
  '../../assets/photos/**/*.jpg?w=480;768;1024;1500&format=jpg&as=srcset',
  { eager: false },
);
```

- `eager: false` yields dynamic `import()` calls — Vite code-splits each chunk.
- Pair with `gallery.json` to map IDs → glob keys → resolved URLs.

### 2.5 Component Hierarchy

```
Photos (page)
├── PageHero
├── GallerySection × N          (one per category)
│   ├── SectionHeader
│   └── GalleryGrid
│       └── PhotoCard × N       (molecule — magnetic + spotlight effects)
├── PhotoModal                  (organism — lightbox / carousel)
│   ├── ModalImage
│   ├── NavigationControls
│   └── PrintCTA
└── Footer
```

- `PhotoCard` owns: `loading="lazy"`, `decoding="async"`, `srcSet`, `sizes`, `width`/`height`, magnetic interaction, spotlight overlay, click → modal delegation.
- `PhotoModal` owns: focus trap, keyboard navigation, swipe gestures, high-res image swap, print CTA surface.

---

## 3. Image Optimization Workflow

### 3.1 RAW Export Strategy

- Export from Lightroom/Capture One as **sRGB JPEG, quality 90–95, longest edge 2000–3000 px**.
- Apply watermark at export (Lightroom export preset or Photoshop action).
- Output naming: `IMG_{ID}-web-watermarked-2.jpg`.

### 3.2 Resizing Strategy (Breakpoints)

| Breakpoint | Width (px) | Use Case               |
| ---------- | ---------- | ---------------------- |
| xs         | 480        | Mobile grid thumbnails |
| sm         | 768        | Tablet grid            |
| md         | 1024       | Desktop grid           |
| lg         | 1500–2000  | Lightbox / hero        |

These widths are passed to `vite-imagetools` via the `?w=480;768;1024;1500` query string.

### 3.3 WebP / AVIF Conversion

```ts
// Produce WebP srcSet alongside JPEG
import srcSetWebP from './photo.jpg?w=480;768;1024;1500&format=webp&as=srcset';
```

- Use `<picture>` with `<source type="image/webp">` + `<source type="image/avif">` + `<img>` fallback when format negotiation is needed.
- For simpler setups, Vite's `Accept` header negotiation via CDN can serve the optimal format automatically.

### 3.4 Compression Tooling

**Build-time (in Vite pipeline):**

```ts
// vite.config.ts
import viteImagemin from 'vite-plugin-imagemin';

viteImagemin({
  mozjpeg: { quality: 75, progressive: true },
  pngquant: { quality: [0.65, 0.8], speed: 3 },
  optipng: { optimizationLevel: 3 },
});
```

**Pre-commit / batch (standalone script):**

```ts
import sharp from 'sharp';

await sharp(input)
  .resize({ width: 1500, withoutEnlargement: true })
  .jpeg({ quality: 80, progressive: true, mozjpeg: true })
  .toFile(output);
```

### 3.5 Naming Conventions

```
{CAMERA_ID}-web-watermarked-{version}.{ext}
```

| Segment        | Rule                                               |
| -------------- | -------------------------------------------------- |
| Camera ID      | Preserve original (e.g. `IMG_4725`)                |
| `-web`         | Indicates web-optimized export                     |
| `-watermarked` | Indicates watermark applied                        |
| `-{version}`   | Increment on re-export                             |
| `.jpg`         | Source extension; Vite generates variants at build |

### 3.6 Thumbnail / LQIP Generation

- **Thumbnail:** 480 px width variant from the srcSet pipeline — no extra step needed.
- **LQIP (optional):** Generate a 20 px blurred placeholder inline as base64:

```ts
const lqip = await sharp(input).resize(20).blur(5).toBuffer();
const dataUri = `data:image/jpeg;base64,${lqip.toString('base64')}`;
```

Embed in `gallery.json` as `"lqip": "data:image/jpeg;base64,..."`.

### 3.7 Automation Script

```bash
# scripts/optimize-images.mjs
# Usage: node scripts/optimize-images.mjs src/assets/photos
```

Script responsibilities:

1. Walk `src/assets/photos/**/*.jpg`.
2. Skip files already under size threshold (< 500 KB).
3. Resize to max 2000 px longest edge.
4. Compress with mozjpeg quality 80.
5. Generate LQIP base64 strings.
6. Update `src/data/gallery.json` with new entries (id, dimensions, LQIP).

---

## 4. React Implementation Pattern

### 4.1 Reusable Component Structure

```
PhotoCard (molecule)
  Props: image, alt, caption, width, height, srcSet, sizes, onClick, className
  Behavior: magnetic effect, spotlight overlay, lazy image, accessibility
```

- Accept `srcSet` and `sizes` as first-class props — the parent page owns the responsive strategy.
- Attach `width` and `height` to the `<img>` for intrinsic aspect ratio (CLS prevention).
- Wrap interactive cards with `role="button"`, `tabIndex={0}`, and keyboard handler.

### 4.2 Lazy Loading Strategy

- **Native:** `loading="lazy"` + `decoding="async"` on every `<img>` (already implemented in PhotoCard).
- **Eager above-fold:** Hero image should use `loading="eager"` and `fetchpriority="high"`.
- **Modal images:** Load full-res variant only when modal opens (dynamic `import()`).

### 4.3 Intersection Observer Usage

- Use for triggering entrance animations (fade-in, scale) — **not** for image loading (defer to native `loading="lazy"`).
- Wrap in a custom `useInView` hook with `rootMargin: '200px'` for early trigger.
- Disconnect observer after first intersection for one-shot animations.

### 4.4 State Management

- Gallery page state: `useState` + `useMemo` (current pattern — sufficient for < 50 sections).
- Modal state: `useState` for `modalOpen` + `currentIndex`; derive `currentPhoto` from the flat `allPhotos` array.
- At scale (100+ categories, filters, search): introduce Zustand or URL-based state via React Router search params.

### 4.5 Avoiding Unnecessary Re-renders

- `useMemo` the merged `allPhotos` array — recompute only when underlying arrays change.
- Photo data arrays defined at module scope (outside component) — never recreated on render.
- `PhotoCard` is a pure functional component; wrap in `React.memo` only if profiling reveals render churn.
- Magnetic / spotlight hooks use refs and CSS custom properties — no state-driven re-renders.

### 4.6 Code Splitting Strategy

| Chunk                    | Strategy                                     |
| ------------------------ | -------------------------------------------- |
| Photos page              | `React.lazy()` via `.lazy.tsx` barrel        |
| PhotoModal               | Dynamic `import()` triggered on first open   |
| Image assets             | `vite-imagetools` generates per-image chunks |
| Magnetic/Spotlight hooks | Bundled with PhotoCard; negligible size      |

---

## 5. Performance Engineering Checklist

### Targets

| Metric              | Target   | Measurement                     |
| ------------------- | -------- | ------------------------------- |
| LCP                 | < 2.5 s  | Lighthouse mobile, 3G throttled |
| FCP                 | < 1.5 s  | Lighthouse mobile               |
| CLS                 | < 0.05   | Lighthouse mobile               |
| TBT                 | < 200 ms | Lighthouse mobile               |
| Performance score   | ≥ 90     | Lighthouse                      |
| Accessibility score | ≥ 95     | Lighthouse                      |
| SEO score           | ≥ 95     | Lighthouse                      |

### Image Size Budget

| Variant                       | Max File Size |
| ----------------------------- | ------------- |
| Thumbnail (480 w)             | 40 KB         |
| Grid card (768–1024 w)        | 120 KB        |
| Lightbox / hero (1500–2000 w) | 250 KB        |

### CLS Prevention Checklist

- [ ] Every `<img>` has explicit `width` and `height` attributes.
- [ ] Grid cells use `aspect-ratio` CSS or padding-bottom hack.
- [ ] Fonts are preloaded; `font-display: swap` set.
- [ ] No layout-shifting ads or CTAs injected after paint.

### Caching Strategy

- Vite asset hashing (content hash in filename) enables **immutable** `Cache-Control` headers.
- Set `Cache-Control: public, max-age=31536000, immutable` for hashed assets.
- HTML entry: `Cache-Control: no-cache` (revalidate on deploy).
- Service worker (Workbox) for offline gallery browsing (optional).

### CDN Recommendations

| Provider           | Use Case                                                          |
| ------------------ | ----------------------------------------------------------------- |
| Firebase Hosting   | Current deployment target; global CDN built-in                    |
| Cloudflare         | Edge caching, image resizing (paid plan)                          |
| Imgix / Cloudinary | On-the-fly transforms, format negotiation, responsive breakpoints |
| Vercel Edge        | Alternative hosting with automatic image optimization             |

---

## 6. SEO & Print Conversion Layer

### 6.1 Alt Text Strategy

- **ADA-compliant, descriptive, keyword-rich, max 125 characters.**
- Never prefix with "image of" or "picture of."
- Describe subject, action, context, and mood.
- Examples:
  - `"Midfielder controlling the ball during a Bandits FC night match under stadium lights"`
  - `"Youth soccer player celebrating a goal with teammates on a sunlit grass field"`
- Store alt text in `gallery.json`; never hardcode generic placeholders (`"Photo 1"`).

### 6.2 Structured Data (Schema.org)

Inject `ImageObject` JSON-LD per gallery page:

```jsonc
{
  "@context": "https://schema.org",
  "@type": "ImageGallery",
  "name": "Bandits FC — Match Photography",
  "image": [
    {
      "@type": "ImageObject",
      "contentUrl": "https://example.com/photos/IMG_4725.jpg",
      "description": "Midfielder controlling the ball during a Bandits FC night match",
      "width": 2000,
      "height": 1333,
    },
  ],
}
```

### 6.3 Image Sitemap

Generate `public/image-sitemap.xml` at build time from `gallery.json`:

```xml
<url>
  <loc>https://example.com/photos</loc>
  <image:image>
    <image:loc>https://example.com/photos/IMG_4725.jpg</image:loc>
    <image:caption>Bandits FC match photography</image:caption>
  </image:image>
</url>
```

Submit via Google Search Console.

### 6.4 Metadata Injection

- Use `react-helmet-async` or a Vite SSR plugin to inject `<meta property="og:image">`, `<meta name="description">`, and `<title>` per page.
- Generate Open Graph images (1200 × 630) from hero shots.

### 6.5 Print CTA Positioning

- **In-lightbox:** Persistent "Order Print" button anchored to modal footer.
- **On-hover card overlay:** Subtle icon badge; avoid obstructing the image.
- **Gallery section footer:** "Order prints from this collection" banner after the grid.
- CTA links to external storefront (Pixieset, ShootProof) or internal checkout.

### 6.6 UX for Sales Conversion

- Mobile-first: touch-friendly lightbox with swipe navigation.
- High-res lightbox images build purchase confidence.
- Minimal friction: CTA opens in-context sheet or new tab; avoid redirecting away from gallery.
- Social proof: optional testimonial strip between gallery sections.

---

## 7. Deployment Strategy

### 7.1 Hosting

| Platform                       | Setup                                                               |
| ------------------------------ | ------------------------------------------------------------------- |
| **Firebase Hosting** (current) | `firebase.json` with rewrites; global CDN built-in                  |
| Vercel                         | Zero-config Vite deployment; automatic image optimization available |
| Netlify                        | Similar to Vercel; add `_headers` for cache policy                  |

### 7.2 Edge Caching

- Hashed static assets: immutable edge cache (1 year).
- HTML: short TTL or stale-while-revalidate.
- API / CMS data: cache at edge with 60 s TTL; ISR where supported.

### 7.3 Static Generation vs Hybrid Rendering

- **Default: fully static SPA** — `vite build` produces hashed assets; suitable for ≤ 500 images.
- **Hybrid (SSR/SSG):** Transition to Vite SSR or Astro when SEO requires server-rendered HTML for each gallery/category URL.
- Use prerendering plugins (`vite-plugin-ssr`, `@tanstack/router` with SSR) to emit static HTML per route.

### 7.4 Environment Considerations

- `.env.production` for CMS API keys, analytics IDs.
- Separate asset buckets per environment only if using external storage.
- Preview deployments (Vercel preview / Firebase preview channels) for QA before production promotion.

---

## 8. Failure Modes & Anti-Patterns

### Common Image-Heavy Site Mistakes

| Anti-Pattern                        | Consequence                     | Fix                                         |
| ----------------------------------- | ------------------------------- | ------------------------------------------- |
| Committing RAW / full-res files     | Repo bloat (GB+), slow clones   | External storage; commit web-optimized only |
| Single image size for all viewports | Wasted bandwidth on mobile      | `srcSet` + `sizes` via `vite-imagetools`    |
| Missing `width`/`height` on `<img>` | CLS spikes                      | Always set intrinsic dimensions             |
| Generic alt text (`"Photo 1"`)      | SEO penalty, ADA non-compliance | Descriptive, keyword-rich alt per image     |
| Eager-loading all images            | Slow FCP, high data transfer    | `loading="lazy"` + `decoding="async"`       |
| Inlining base64 for large images    | HTML bloat, non-cacheable       | Use only for LQIP (≤ 1 KB)                  |

### Performance Traps

- **No build-time compression:** Relying solely on CDN compression misses mozjpeg/optipng gains. Run both.
- **Missing `sizes` attribute:** Browser downloads the largest srcSet variant by default when `sizes` is absent.
- **Excessive DOM nodes:** Rendering 2000 `<img>` tags simultaneously. Virtualize with `react-window` or paginate.

### Architecture Pitfalls

- **Tight-coupling photo data to page component:** Photo arrays defined inline make it impossible to filter, search, or paginate. Extract to `gallery.json` or context.
- **No category abstraction:** Adding a new category should require only a new folder + JSON entries, not new import blocks.
- **Monolithic modal:** Splitting lightbox, navigation, and print CTA into composable sub-components prevents prop-chain explosion.

---

## 9. Future Expansion Roadmap

### 9.1 Headless CMS Integration

- Migrate `gallery.json` to Sanity or Strapi.
- Build-time fetch via `vite-plugin-ssr` data loader or Astro content collections.
- Benefits: non-developer editing, tagging UI, search, and pagination.

### 9.2 AI Tagging

- Integrate Google Vision, AWS Rekognition, or open-source CLIP for auto-generated tags and alt text drafts.
- Human review loop: AI generates → photographer approves/edits → commits to CMS.

### 9.3 Private Client Galleries

- Authenticated routes (Firebase Auth, Supabase Auth).
- Shareable gallery links with time-limited tokens.
- Per-client image selection and favorites.

### 9.4 E-Commerce Integration

| Option                           | Complexity  | Notes                                               |
| -------------------------------- | ----------- | --------------------------------------------------- |
| Pixieset / ShootProof (external) | Low         | Link out from CTA                                   |
| Stripe Checkout (embedded)       | Medium      | Custom product catalog, webhook fulfillment         |
| Shopify Storefront API           | Medium–High | Full cart, product variants, fulfillment            |
| Custom checkout                  | High        | Full control; requires PCI compliance consideration |

### 9.5 CDN Image Transformations

- Replace build-time `vite-imagetools` pipeline with runtime transforms via Imgix, Cloudinary, or Cloudflare Image Resizing.
- Benefits: no build-time penalty, on-demand format negotiation, URL-based crop/resize.
- Trade-off: runtime latency on first request; mitigated by edge caching.

# Style Guide

This document outlines the design principles, patterns, and conventions used in this project.

## Table of Contents

1. [Design Methodology](#design-methodology)
2. [Folder Structure](#folder-structure)
3. [Styling Approach](#styling-approach)
4. [Typography System](#typography-system)
5. [Color System](#color-system)
6. [Accessibility (WCAG AAA)](#accessibility-wcag-aaa)
7. [SEO Best Practices](#seo-best-practices)
8. [Component Guidelines](#component-guidelines)

---

## Design Methodology

This project follows **[Atomic Design](https://atomicdesign.bradfrost.com/)** principles by Brad Frost. Components are organized hierarchically from smallest to largest:

### Atoms
The foundational building blocks that cannot be broken down further without losing meaning.
- **Examples:** Pill, buttons, inputs, labels
- **Location:** `src/atoms/`
- **Purpose:** Reusable, single-purpose UI elements

### Molecules
Simple combinations of atoms that work together as a unit.
- **Examples:** Card, search form
- **Location:** `src/molecules/`
- **Purpose:** Small functional components following single responsibility principle

### Organisms
Complex UI components composed of molecules, atoms, or other organisms that form distinct interface sections.
- **Examples:** FeatureCard, Nav, Footer
- **Location:** `src/organisms/`
- **Purpose:** Standalone, context-aware sections of the interface

### Templates
Page-level layouts that place organisms into a structure and define content hierarchy.
- **Location:** Layout components in `src/styles/modules/`
- **Purpose:** Define the skeleton and content structure

### Pages
Specific instances of templates with real representative content.
- **Location:** `src/pages/`
- **Purpose:** Final user-facing interfaces with actual content

---

## Folder Structure

```
src/
  atoms/                  # Smallest UI elements
    Pill/
  molecules/              # Simple combinations of atoms
    Card/
  organisms/              # Complex, distinct UI sections
    FeatureCard/
    Nav/
    Footer/
  pages/                  # Complete pages with real content
    Home/
  styles/                 # Global styles and design tokens
    typography.css        # Typography system with @layer
    modules/              # Reusable layout patterns
      container.module.css
  assets/                 # Images, icons, fonts
```

---

## Styling Approach

### CSS-First, Tailwind-Powered

We use **Tailwind CSS v4** with a CSS-first approach:

1. **Design tokens defined in `@theme`** (in `src/index.css`)
2. **Component styles use `@apply`** to apply Tailwind utilities
3. **Minimal inline Tailwind utilities in JSX** - only for one-off spacing or layout
4. **CSS Modules for component-specific styles**

### Key Principles

#### ✅ DO: Use `@apply` in CSS
```css
@layer components {
  .title2 {
    font-size: 3.5rem;
    @apply text-primary-darker text-center;
  }
}
```

#### ✅ DO: Define design tokens in `@theme`
```css
@theme {
  --color-primary: var(--color-red);
  --color-primary-darker: var(--color-red-darker);
}
```

#### ❌ DON'T: Scatter utility classes throughout JSX
```tsx
// Bad - color/typography utilities in JSX
<h2 className="title2 text-primary-darker text-center">

// Good - absorbed into CSS
<h2 className="title2">
```

#### ❌ DON'T: Use conflicting Tailwind utility names
```css
/* Bad - conflicts with Tailwind's built-in 'overline' utility */
.overline { ... }

/* Good - unique name */
.text-overline { ... }
```

### CSS Architecture

- **Global styles:** `src/index.css`
- **Typography:** `src/styles/typography.css` (uses `@layer components`)
- **Component styles:** CSS Modules (`*.module.css`)
- **Reference theme tokens:** Use `@reference "../../index.css"` in CSS modules

---

## Typography System

Typography classes are defined in `src/styles/typography.css` using `@layer components`.

### Heading Classes

| Class | Size (Mobile → Tablet → Desktop) | Default Color |
|-------|----------------------------------|---------------|
| `.display` | text-5xl → text-7xl → text-9xl | `text-primary` |
| `.title1` | text-3xl → text-5xl → text-7xl | `text-primary-darker` |
| `.title2` | text-xl → text-3xl → text-5xl | `text-primary-darker` |
| `.title3` | text-base → text-xl → text-3xl | `text-primary` |
| `.title4` | text-base → text-lg → text-xl | `text-primary` |

### Text Classes

| Class | Purpose | Default Color |
|-------|---------|---------------|
| `.caption` | Body text, descriptions | `text-secondary-light` |
| `.text-overline` | Section labels (uppercase) | `text-secondary text-center` |

### Color Overrides

When a heading needs a different color, use Tailwind utilities (they override `@layer components`):

```tsx
<h3 className="title2 text-primary">My craft</h3>
```

### Usage

```tsx
// ✅ Good - semantic class names
<h1 className="display">Ashu Jainvi</h1>
<h2 className="title2">Visual Artist</h2>
<p className="caption">Description text here</p>

// ❌ Bad - mixing style concerns
<h2 className="text-3xl font-bold text-red-500">
```

---

## Readability

### Line Length

For body/paragraph text, limit line length to **65 characters** (`--width-prose: 65ch`). This follows the widely accepted readability guideline of 45–75 characters per line, optimizing for comfortable reading and reducing eye strain.

- Use `max-width: var(--width-prose)` on prose containers
- Center prose blocks with `margin: 0 auto`
- This applies to long-form content like About pages, blog posts, and descriptions — not to headings, navigation, or UI controls

---

## Color System

Colors are defined in two places for Tailwind integration:

### 1. CSS Custom Properties (`:root` in `index.css`)

```css
:root {
  /* Base colors */
  --color-red: #e31329;
  --color-red-dark: #a10515;
  --color-red-darker: #3B050B;
  --color-yellow: #f5c58c;
  --color-yellow-light: #FFE4C4;
  
  --color-primary: var(--color-red);
  --color-primary-dark: var(--color-red-dark);
  --color-primary-darker: var(--color-red-darker);
  --color-secondary: var(--color-yellow);
  --color-secondary-light: var(--color-yellow-light);
  
  /* UI colors */
  --color-bg-primary: var(--color-gray-1);
  --color-bg-secondary: var(--color-gray-2);
  --color-text-primary: var(--color-gray-4);
  --color-border-primary: var(--color-gray-3);
}
```

### 2. Tailwind Theme Tokens (`@theme` in `index.css`)

```css
@theme {
  --color-primary: var(--color-primary);
  --color-primary-dark: var(--color-red-dark);
  --color-primary-darker: var(--color-red-darker);
  --color-secondary: var(--color-secondary);
  --color-secondary-light: var(--color-yellow-light);
}
```

This enables:
- **CSS usage:** `var(--color-primary)`
- **Tailwind utilities:** `text-primary`, `bg-primary`, etc.
- **Single source of truth:** Change colors in one place

### Color Usage

```tsx
// ✅ Good - Tailwind utility or typography class
<span className="text-primary">Red text</span>
<h2 className="title2">Uses text-primary-darker by default</h2>

// ✅ Good - CSS variable in module
.card {
  background-color: var(--color-bg-primary);
}

// ❌ Bad - hardcoded color
<div style={{ color: '#e31329' }}>
```

---

## Accessibility (WCAG AAA)

This project targets **WCAG 2.2 Level AAA** compliance. Every component must follow these principles.

### Images

- **Informative images** must have descriptive `alt` text that conveys the image's meaning or purpose.
- **Decorative images** must use `alt=""` and `role="presentation"` so assistive technology skips them.
- Never leave `alt` undefined — always make an explicit choice between informative and decorative.

```tsx
// ✅ Good - informative image
<img src={photo} alt="Ashu standing outdoors in Austin, Texas" />

// ✅ Good - decorative image
<img src={bg} alt="" role="presentation" />

// ❌ Bad - missing or vague alt
<img src={photo} />
<img src={photo} alt="image" />
```

### Color Contrast

- **Text** must meet a **7:1** contrast ratio against its background (AAA).
- **Large text** (≥ 18pt / 24px, or ≥ 14pt / 18.66px bold) must meet **4.5:1** (AAA).
- **UI components and graphical objects** must meet **3:1** against adjacent colors.
- Use tools like [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) to verify.

### Semantic HTML

- Use the correct HTML element for its purpose: `<button>` for actions, `<a>` for navigation, `<nav>`, `<main>`, `<section>`, `<article>`, `<figure>`, `<figcaption>`, etc.
- Never use `<div>` or `<span>` for interactive elements.
- Heading levels (`h1`–`h6`) must follow a logical hierarchy — never skip levels.

```tsx
// ✅ Good - semantic figure with caption
<figure>
  <img src={photo} alt="Portrait of Ashu" />
  <figcaption>ashu.jpeg</figcaption>
</figure>

// ❌ Bad - div soup
<div>
  <img src={photo} />
  <span>ashu.jpeg</span>
</div>
```

### Focus Management

- All interactive elements must have a **visible focus indicator** with sufficient contrast.
- Focus styles should use `outline` (not just `border` or `box-shadow`).
- Use `--color-focus-ring` for consistent focus styling across the project.
- Never use `outline: none` without a replacement focus style.
- Support `focus-visible` to show focus rings only for keyboard navigation.

```css
/* ✅ Good */
.button:focus-visible {
  outline: 0.125rem solid var(--color-focus-ring);
  outline-offset: 2px;
}

/* ❌ Bad */
.button:focus {
  outline: none;
}
```

### Keyboard Navigation

- All interactive elements must be reachable and operable via keyboard.
- Custom interactive elements must handle `Enter` and `Space` key events.
- Avoid positive `tabIndex` values; use `tabIndex={0}` for custom focusable elements.

### Motion & Animations

- Respect `prefers-reduced-motion` — disable or reduce animations for users who request it.

```css
@media (prefers-reduced-motion: reduce) {
  .animated {
    transition: none;
    animation: none;
  }
}
```

### Forms

- Every input must have a visible `<label>` associated via `htmlFor`/`id`.
- Use `aria-describedby` for supplementary help text or error messages.
- Use `aria-invalid="true"` to indicate validation errors.
- Group related fields with `<fieldset>` and `<legend>`.

### ARIA Rules

- Prefer semantic HTML over ARIA — only add ARIA attributes when native semantics are insufficient.
- Never use `aria-label` on non-interactive elements that already have visible text.
- Test with a screen reader (VoiceOver on macOS) when adding ARIA attributes.

---

## SEO Best Practices

This project is a client-side rendered React SPA. Because SPAs serve a single HTML shell and rely on JavaScript to render content, additional care is needed to ensure visibility to search engines and social platforms.

> **Reference:** [Yalantis — React SEO-Friendly Optimization Tips & Best Practices](https://yalantis.com/blog/search-engine-optimization-for-react-apps/)

### Architecture

#### Per-Page Meta Tags (Seo Component)

Every page **must** include the `<Seo>` component (`src/components/Seo/Seo.tsx`) as the first child inside its root element. This dynamically sets document title, meta description, Open Graph tags, Twitter Card tags, and the canonical URL.

```tsx
// ✅ Good — each page has unique meta
import Seo from '../../components/Seo/Seo';

const About = () => (
  <>
    <Seo
      title="About"
      description="Learn about Ashu Jainvi — a senior UI developer..."
      path="/about"
      type="profile"
    />
    <PageHero overline="Get to know" title="About Me">
      ...
    </PageHero>
  </>
);

// ❌ Bad — relying on index.html defaults for every page
const About = () => <PageHero>...</PageHero>;
```

| Prop | Required | Details |
|------|----------|---------|
| `title` | Yes | Page-specific title (appended with `\| Ashu Jainvi`) |
| `description` | No | 50–160 character summary; defaults to site description |
| `path` | No | URL path (e.g., `/about`); used for canonical URL |
| `image` | No | OG/Twitter image URL; defaults to `/og-image.jpg` |
| `type` | No | `website` (default), `article`, or `profile` |

#### index.html Defaults

The `index.html` file provides **fallback** SEO metadata for crawlers that don't execute JavaScript (Facebook, Twitter/X, LinkedIn, Slack, etc.). It includes:

- `<meta name="description">`
- Open Graph tags (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`)
- Twitter Card tags (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`)
- Structured data (JSON-LD `Person` schema)
- `<link rel="canonical">`
- `<noscript>` fallback with critical content

> **Important:** When updating the site's default branding or description, update **both** `index.html` and the constants in `src/components/Seo/Seo.tsx`.

### Title Tags

- Every page must have a **unique, descriptive title**.
- Follow the format: `Page Name | Ashu Jainvi`.
- Keep titles under **60 characters** to avoid truncation in SERPs.
- The homepage title should describe the primary value proposition.

```
✅ "Photography Portfolio | Ashu Jainvi"
✅ "About | Ashu Jainvi"
❌ "Home"
❌ "Ashu Jainvi | Visual Artist | Photographer | UI Developer | Austin TX"
```

### Meta Descriptions

- Every page must have a **unique meta description**.
- Keep descriptions between **50–160 characters**.
- Include relevant keywords naturally — no keyword stuffing.
- Write descriptions that encourage click-through from search results.

```
✅ "Browse Ashu Jainvi's photography portfolio featuring portrait sessions,
    Bandits FC soccer shots, and youth sports photography in Austin, Texas."
❌ "photography photos pictures images portfolio gallery Austin"
```

### Open Graph & Social Sharing

For each page, the Seo component sets OG and Twitter Card tags. For optimal social sharing:

- **OG Image:** Use a 1200×630px image. Keep the default `og-image.jpg` in the `public/` folder.
- **OG Type:** Use `website` for most pages, `profile` for the About page.
- **OG Description:** Mirrors the meta description.

### Canonical URLs

Every page must declare a **canonical URL** via the Seo component's `path` prop. This prevents duplicate-content issues from:

- Trailing slashes (`/about` vs `/about/`)
- Query parameters (`/photos?ref=nav`)
- Firebase Hosting alternative domains

### Structured Data (JSON-LD)

A `Person` schema is embedded in `index.html` using JSON-LD. This helps Google display rich results (knowledge panels, enhanced search listings).

When adding new structured data:

- Use `<script type="application/ld+json">` in `index.html` or render it from the Seo component
- Validate with [Google Rich Results Test](https://search.google.com/test/rich-results)
- Follow [Schema.org](https://schema.org/) vocabulary

### Sitemap & Robots

- **`public/sitemap.xml`**: Lists all public pages with `<changefreq>` and `<priority>`. Update whenever new pages are added.
- **`public/robots.txt`**: Allows all crawlers and points to the sitemap.

When adding a new page:
1. Add a `<url>` entry to `sitemap.xml`
2. Add the `<Seo>` component to the page with unique title/description

### Semantic HTML for SEO

Semantic elements help search engines understand page structure:

- Use **one `<h1>` per page** — the primary topic.
- Follow a **logical heading hierarchy** (`h1` → `h2` → `h3`); never skip levels.
- Use `<main>`, `<section>`, `<article>`, `<nav>`, `<header>`, `<footer>` appropriately.
- Use `<figure>` + `<figcaption>` for images with captions.

```tsx
// ✅ Good — clear heading hierarchy
<h1 className="display">Photos</h1>
<h2 className="title4">Featured</h2>
<h2 className="title4">Bandits FC</h2>

// ❌ Bad — skipping heading levels
<h1>Photos</h1>
<h4>Featured</h4>
```

### Images & Media

- Provide **descriptive `alt` text** for all meaningful images — this is critical for both accessibility and image SEO.
- Use **`width` and `height` attributes** on `<img>` to prevent layout shifts (improves Core Web Vitals CLS score).
- Use **responsive `srcSet` and `sizes`** for optimal loading across devices.
- **Lazy-load** off-screen images with `loading="lazy"` where appropriate.
- Compress images via `vite-plugin-imagemin` (already configured).

```tsx
// ✅ Good — SEO-optimized image
<img
  src={photo}
  srcSet={photoSrcSet}
  sizes="(max-width: 639px) 50vw, 33vw"
  alt="Bandits FC player dribbling past defender during night match"
  width={1500}
  height={2000}
  loading="lazy"
/>

// ❌ Bad — generic or missing alt, no dimensions
<img src={photo} alt="image" />
```

### URL Structure

- Use **clean, descriptive URLs** (`/about`, `/photos`, `/contact`).
- Avoid query parameters for navigable content.
- Firebase Hosting's `cleanUrls: true` strips `.html` extensions automatically.

### Performance (Core Web Vitals)

Google uses [Core Web Vitals](https://web.dev/vitals/) as ranking signals. Maintain:

- **LCP (Largest Contentful Paint):** < 2.5s — optimize hero images, preload critical assets.
- **FID/INP (Interaction to Next Paint):** < 200ms — avoid long-running scripts on interaction.
- **CLS (Cumulative Layout Shift):** < 0.1 — always specify image dimensions, avoid layout-shifting content.

Existing optimizations:
- Image compression (`vite-plugin-imagemin`)
- Responsive images (`vite-imagetools` with `srcSet`)
- Font preconnect for Google Fonts
- Code splitting via React lazy routes

### Caching Strategy

Firebase Hosting is configured with aggressive caching headers for static assets:

- Images, JS, CSS, and fonts: `Cache-Control: public, max-age=31536000, immutable`
- Vite's content-hashed filenames ensure cache-busting on updates

### SPA-Specific Considerations

Since this is a client-side SPA:

1. **Google can render JavaScript** — Googlebot runs JavaScript and will see dynamically rendered content. However, rendering may be delayed (deferred by the Web Rendering Service).
2. **Social crawlers cannot** — Facebook, Twitter, LinkedIn crawlers do **not** execute JS. They rely on `index.html` default meta tags. This means social share previews will use the homepage metadata for all pages.
3. **Crawl budget** — for a small portfolio site, this is not a concern. For larger SPAs, consider prerendering.
4. **If SSR/prerendering is needed in the future** — consider migrating to a framework like Next.js or using a prerendering service.

---

## Component Guidelines

### Creating New Components

#### 1. Determine Atomic Level

Ask: "Can this be broken down further without losing functionality?"
- **Yes** → It's an organism or molecule
- **No** → It's an atom

#### 2. Component Structure

```
src/[atoms|molecules|organisms]/ComponentName/
  ComponentName.tsx           # Component logic
  ComponentName.module.css    # Scoped styles (if needed)
  ComponentName.stories.tsx   # Storybook stories
```

#### 3. Styling Strategy

**Choose based on complexity:**

- **Simple atoms:** May not need CSS module, use typography classes
- **Molecules/organisms:** Use CSS modules with `@apply`
- **One-off spacing:** Inline Tailwind utilities (e.g., `mt-4`, `gap-6`)



### Component Composition

**Build from smaller parts:**

```tsx
// ✅ Good - composing from smaller components
<FeatureCard>  {/* organism */}
  <Card>       {/* molecule */}
    <Pill />   {/* atom */}
  </Card>
</FeatureCard>

// ❌ Bad - monolithic component
<BigFeatureCardWithEverythingInside />
```

### Props and Variants

Use TypeScript interfaces and controlled variants:

```tsx
interface CardProps {
  children: ReactNode;
  shape?: 'ellipse' | 'rectangle';  // ✅ Specific variants
}

// ❌ Avoid: variant?: string (too loose)
```

---

## Design Tokens Reference

### Spacing Scale

Use Tailwind's default spacing (`mt-4`, `gap-6`, `p-12`) or define custom in `@theme`.

### Breakpoints

Tailwind defaults:
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

### Border Radius

```css
@theme {
  --radius-5xl: 3.5rem;
}
```

Usage: `rounded-5xl` or `@apply rounded-5xl`

---

## Summary

### Core Principles

1. **Follow Atomic Design** - organize components by complexity
2. **CSS-first with Tailwind** - use `@apply` in CSS, not JSX
3. **Centralize design tokens** - define in `@theme` and `:root`
4. **Typography classes** - use semantic names, responsive by default
5. **WCAG AAA accessibility** - semantic HTML, contrast, focus, alt text
6. **SEO on every page** - unique title, description, canonical URL, and OG tags via `<Seo>` component
7. **Single responsibility** - each component does one thing well

### When to Update This Guide

- Adding new atomic components
- Introducing new design patterns
- Changing color/typography systems
- Establishing new conventions
- **Adding new pages** — update `sitemap.xml` and add `<Seo>` component

---

**Last Updated:** February 16, 2026

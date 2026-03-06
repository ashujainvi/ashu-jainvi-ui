Run through this checklist for the current codebase. For each item, verify compliance and report pass/fail with details. Fix any issues found.

## SEO Checklist

- [ ] Every page in `src/pages/` uses the `<Seo>` component with a unique title and description
- [ ] `public/sitemap.xml` includes all routes from `src/App.tsx` (including dynamic album pages from `src/data/photos.ts`)
- [ ] `index.html` meta tags (description, OG, Twitter) are consistent with `src/components/Seo/Seo.tsx` defaults
- [ ] OG image path in `Seo.tsx` matches the actual file in `public/`
- [ ] JSON-LD structured data in `index.html` has populated `sameAs` array with social profiles
- [ ] Every page has exactly one `<h1>` and heading levels don't skip (h1 > h2 > h3)
- [ ] All meaningful images have descriptive `alt` text (not "image" or empty)
- [ ] All images have `width` and `height` attributes to prevent CLS
- [ ] `public/robots.txt` exists and references the sitemap URL

## Linking Checklist

- [ ] All internal navigation uses React Router `<Link>` or the `Button` component with `as="link"` — no raw `<a>` tags for internal routes
- [ ] All external links have `target="_blank"` and `rel="noopener noreferrer"`

## Accessibility Spot Check

- [ ] Interactive elements (buttons, links) have visible focus styles
- [ ] Decorative images use `alt=""` with `role="presentation"`
- [ ] Modals use `role="dialog"`, `aria-modal="true"`, and focus trapping

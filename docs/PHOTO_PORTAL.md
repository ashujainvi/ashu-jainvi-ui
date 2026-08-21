# Private photo delivery portal

The portfolio now includes two private routes:

- `/studio` creates client albums and uploads finished Lightroom exports.
- `/clients/:albumSlug` shows a password-protected gallery with favorites and downloads.

One Cloudflare Worker serves the Vite portfolio and provides the portal API:

- R2 stores each private source photograph once.
- The Cloudflare Images binding creates one optimized gallery preset from the private R2 source.
- D1 stores albums, image metadata, client favorites, and cost-cap usage.
- The Worker checks the client session before returning an optimized image.
- Full-resolution downloads are disabled by default and can be enabled per album.
- Application limits cap portal storage at 9 GB, each upload at 50 MB, and new monthly gallery transformations at 4,500.

## One-time Cloudflare setup

From the repository root:

1. Sign in with `npm --prefix cloudflare exec wrangler login`.
2. Create the database with `npm --prefix cloudflare exec wrangler d1 create ashu-jainvi-photo-portal`.
3. Put the returned database ID in `wrangler.jsonc`.
4. Create the originals bucket with `npm --prefix cloudflare exec wrangler r2 bucket create ashu-jainvi-photo-originals`.
5. Apply the schema with `npm --prefix cloudflare exec wrangler d1 migrations apply ashu-jainvi-photo-portal --remote --config ../wrangler.jsonc`.
6. The Images binding in `wrangler.jsonc` uses Cloudflare Images directly; no Images API token is required.
7. Add the required secrets:
   - `npm --prefix cloudflare exec wrangler secret put ADMIN_PASSWORD --config ../wrangler.jsonc`
   - `npm --prefix cloudflare exec wrangler secret put SESSION_SECRET --config ../wrangler.jsonc`
8. Build and deploy with `npm run build && npm run deploy --prefix cloudflare`.

The Worker serves portfolio assets directly and runs its script first only for `/api/*`. The production frontend therefore uses same-origin API calls and does not need `VITE_PORTAL_API_URL`. For local development, it defaults to `http://localhost:8787`.

Connect the existing `ashu-jainvi-photo-portal` Worker to GitHub under **Settings → Builds**. Use `master` as the production branch, `npm ci && npm run build && npm ci --prefix cloudflare` as the build command, and `npm run deploy --prefix cloudflare` as the deploy command. Add `VITE_FORMSPREE_FORM_ID` as a secret build variable.

Keep Firebase hosting available as rollback until the Worker preview and both production domains have been verified.

For local development, create `cloudflare/.dev.vars`, fill in non-production `ADMIN_PASSWORD` and `SESSION_SECRET` values, run `npm run dev --prefix cloudflare`, and run the portfolio with `npm run dev` in another terminal.

## Lightroom Classic delivery flow

1. Import, cull, edit, and apply existing presets in Lightroom Classic.
2. Export selected photographs as sRGB JPEGs into a job-specific folder.
3. Open `/studio`, create the album, leave full-resolution downloads off unless the client specifically needs them, and select all exported JPEGs.
4. Send the generated `/clients/:albumSlug` link and its password to the client.
5. Review each album's client-selection count in `/studio`. A detailed per-photograph selection view can be added in a later iteration.

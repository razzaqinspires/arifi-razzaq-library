# QA and changelog

## v0.2.0 — Soft Professional Redesign

### Changes

- Rebuilt the public homepage with a quieter editorial layout, muted sage/off-white palette, simplified creator preview, and clearer content hierarchy.
- Replaced high-contrast dark/gold styling with white surfaces, restrained borders, subtle shadows, and softer typography.
- Reworked responsive behavior for navigation, hero, library cards, detail view, and Creator Studio at mobile widths.
- Reworked library cards and controls; added sorting for newest, downloads, ratings, and likes. Sort values are selected from a server allowlist.
- Reworked release detail and feedback styling, with Indonesian interface copy.
- Added edit-in-place release workflow in Creator Studio and `PUT /api/admin/releases/[id]`; update preserves comments, likes, ratings, and download count.
- Improved metadata: application name, keywords, Open Graph locale/site name, Twitter summary, and light viewport theme color.
- Removed hosted Google Fonts import from the main CSS to avoid a third-party font dependency.
- Updated README and docs for exact paths, workflow, API behavior, and operational notes.

### Files changed

| Path | Purpose / effect |
|---|---|
| `app/page.tsx` | New homepage composition and creator introduction |
| `app/globals.css` | Replaced the design system; responsive public/detail/admin styling |
| `app/layout.tsx` | Updated SEO/social metadata and viewport color |
| `components/site-header.tsx` | Softer navigation and brand mark |
| `components/site-footer.tsx` | Updated footer hierarchy and links |
| `components/library-browser.tsx` | Search, category, sort controls, and redesigned release cards |
| `components/release-detail.tsx` | Updated detail-page interface copy |
| `components/admin-dashboard.tsx` | Added edit workflow and improved form states |
| `app/api/releases/route.ts` | Added allowlisted sorting by date, downloads, likes, and rating |
| `app/api/admin/releases/[id]/route.ts` | Added validated PUT update endpoint |
| `package.json` | Version set to `0.2.0`; no new runtime dependencies |
| `.env.example` | Documented optional local database SSL setting |
| `README.md`, `docs/*.md` | Updated install, operations, architecture, security, and QA docs |

### QA status in this environment

| Check | Result | Detail |
|---|---|---|
| File structure | Pass | App Router pages, UI components, API routes, docs, and SQL schema present |
| JSON parsing | Pass | `package.json` and `tsconfig.json` parse successfully |
| TypeScript/TSX syntax transpilation | Pass | Syntax-only transpilation can be checked with the globally available TypeScript compiler API |
| CSS brace balance | Pass | Stylesheet braces are balanced |
| Dependency installation | Blocked | `npm install --no-audit --no-fund` timed out because the package registry did not respond during this session |
| Full TypeScript typecheck | Not verified | Attempted; dependencies and type declarations were unavailable because installation did not complete |
| ESLint | Not run | Requires installed project dependencies |
| Next.js production build | Not run | Requires installed project dependencies |
| Browser / responsive visual test | Not run | Requires a running Next.js server and browser |
| PostgreSQL integration test | Not run | Requires a configured local/hosted PostgreSQL database |

### Known limitations

- Download binaries are still hosted externally; Creator Studio stores an HTTP/HTTPS file URL but does not upload files.
- No dedicated historical version table. Update the release version and maintain its change history in the changelog field.
- Likes and ratings are keyed to anonymous browser cookies, not verified user accounts.
- Comments publish immediately; an approval queue is not included.
- No distributed rate limiter or CAPTCHA is included yet.
- No real release records are seeded. The catalogue remains empty until content is published.

### Migration and rollback

- **Database migration:** none required for v0.2.0. The current schema is unchanged.
- **Rollback:** restore the v0.1.0 source archive and redeploy if needed. No data rollback is required for the UI/API additions; the new update endpoint only updates columns already present. Back up PostgreSQL before any independent data changes.

## v0.1.0 — Initial Creator Library MVP

- First creator landing page, searchable category library, detail page, download redirect, likes, rating, comments, admin login, release create/delete, and PostgreSQL schema.

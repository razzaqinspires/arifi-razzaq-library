# QA and changelog

## v0.5.0 — Automated Startup & Neon Build Bootstrap — 2026-11-14

### Implemented

- `npm start` now loads `.env` / `.env.local`, bootstraps and verifies the PostgreSQL schema, builds Next.js if `.next/BUILD_ID` is missing, and starts `next start` only after the database and production build are ready.
- `npm run dev` follows the same one-command bootstrap before `next dev`.
- Vercel's configured `ARIFI_VERCEL_BUILD=1 npm run build` command runs a database bootstrap first, requires a valid `DATABASE_URL`, and stops the deployment build if the schema or connection check fails.
- Added PostgreSQL advisory locking around the schema transaction to serialize concurrent build/start bootstrap attempts.
- Added `npm run db:check` and `/api/health` for database diagnostics.
- Sized the lazy Node.js `pg` pool to one client per warm serverless instance; documented Neon pooled connection URI requirements.
- Added `vercel.json`, `docs/AUTOMATED_STARTUP.md`, and updates to README, architecture, deployment/security, Neon setup, worklog, and agent rules.
- Explicitly kept `neon init` / `neon deploy` out of app startup and Vercel request runtime. Those remain one-time infrastructure operations; only the app schema bootstrap is automated.

### Verification status at packaging

- `node --check scripts/build.mjs scripts/check-db.mjs scripts/launch.mjs scripts/setup-db.mjs`: PASS.
- JSON parsing for `package.json` and `vercel.json`, including version and npm hook assertions: PASS.
- `bash -n scripts/setup-neon.sh`: PASS.
- TypeScript `transpileModule` syntax checks for `app/api/health/route.ts` and `lib/db.ts`: PASS (syntax only; no dependency typecheck).
- Startup/build control-flow simulation with temporary mock `pg` and `next` modules: PASS. `npm start` ran schema bootstrap, first-run build and `next start`; a second simulation with an existing build skipped compilation; forced rebuild ran build and start again. `ARIFI_VERCEL_BUILD=1 npm run build` ran schema bootstrap before `next build`. The mock did not contact a real Neon database or run the real Next.js compiler.
- Negative preflight tests: `npm start` stopped when `DATABASE_URL` was absent; `ARIFI_VERCEL_BUILD=1 npm run build` stopped before Next.js build when `DATABASE_URL` was absent. Both behaved as intended.
- `npm run lint`, dependency-backed `npm run typecheck`, and `npm run build`: not run successfully because `node_modules` is absent in this workspace and npm registry access previously failed with `EAI_AGAIN`.
- Live Neon authentication, `neon deploy`, database migration, `/api/health` against the production database, and Vercel deployment remain unverified. No actual credentials were available in the workspace.

### Required Vercel configuration

- Set `DATABASE_URL` to the pooled Neon URI separately for Production and Preview. Use a non-production Neon branch/URL for Preview.
- Set `ADMIN_PASSWORD`, `SESSION_SECRET`, and `NEXT_PUBLIC_SITE_URL` in Vercel Environment Variables.
- Leave Build Command as `ARIFI_VERCEL_BUILD=1 npm run build`. The app's Vercel build script performs the idempotent schema bootstrap before `next build`.
- Do not add `neon init` or `neon deploy` to Vercel Build Command or runtime. Do not store `DATABASE_URL` or provider credentials in source control.

---

## v0.4.0 — 2026-11-14

### Changes

- Added public portfolio, project status labels, website service consultation CTA, static starter template catalogue, and an infrastructure overview.
- Added Company Profile and Product Landing static HTML/CSS starters plus an offline catalogue index.
- Preserved HERU BALI TOUR project source and recorded its supplied public deployment URL.
- Added Neon setup script (with `npx` fallback) and operational documentation for the specified project and `production` branch.
- Added worklog and portfolio documentation plus agent operating rules.
- Extended seed posts for HERU BALI TOUR and WHISKAY-BOT work records.
- Updated `db:setup` to load `.env` and `.env.local` if present; tightened Git ignore rules for environment secrets and local deployment state.

### Verification status at packaging

- Source and documentation edits were inspected.
- Python's standard HTML parser accepted the template catalogue, both starter template pages, and the stored HERU BALI TOUR page.
- `package.json` parsed successfully as JSON.
- `node --check` passed for the database setup script and the HERU BALI TOUR client booking script.
- TypeScript transpile syntax checks passed for the updated TSX files (`app/page.tsx`, `app/layout.tsx`, `components/business-showcase.tsx`, `components/site-header.tsx`, `components/site-footer.tsx`) with zero syntax diagnostics.
- `bash -n scripts/setup-neon.sh` passed with no syntax errors.
- `npm install --ignore-scripts --no-audit --no-fund --fetch-retries=0 --fetch-timeout=15000` failed with `EAI_AGAIN registry.npmjs.org`; dependencies and a lockfile could not be downloaded in this environment.
- A global TypeScript 5.8.3 `tsc --noEmit` attempt did not complete because `next`, `react`, `pg`, and Node type declarations were unavailable without installed dependencies. This is not a pass.
- ESLint, complete dependency-backed typecheck, production build, local browser smoke test, PostgreSQL connection, Neon service provisioning, Vercel environment setup, and live deployment remain unverified. The connected Vercel account context returned no accessible teams/projects in this session, so no deployment was attempted.
- Neon authentication is interactive and requires an authorized account session; project metadata and the setup script are recorded but provisioning is not claimed as complete.

### Next verification commands

```bash
npm install
npm run lint
npm run typecheck
npm run build
npm run db:setup
npm start
```

After `npm start`, verify homepage sections, `/website-templates/index.html` and both starter previews under `/website-templates/`, public API routes, and database-backed CRUD flows. Test Neon Auth, AI Gateway, Object Storage, Functions, and Realtime only after the corresponding feature wiring is implemented.

---


## v0.3.0 — Public Worklog & Community Posts — 2026-11-12

### Implemented

- Repositioned the public website from a release-only creator library into a combined public worklog, digital library, and post-based community.
- Kept the existing downloadable release routes and engagement behavior intact.
- Added an expanded category taxonomy for the library, including coding, bot automation, web, AI, embedded/robotics/IoT, applications, game modding, open source, tutorials, product development, creative work, and documentation.
- Added `posts` with `journal`, `community`, and `announcement` kinds; public/draft visibility; category, tags, optional cover, optional external reference, featured status, and timestamps.
- Added public post listing/search/filter API, post detail API/page, post comment API, admin post create/update/delete/list APIs, and admin comment moderation APIs.
- Added a unified Creator Studio with separate release, post, and moderation tabs.
- Added thirteen launch posts through idempotent schema seed statements. These include six worklog topics and three discussion starters; no internal budget, credentials, or private operations details are included.
- Fixed a variable-shadowing defect in the original release search API so its imported database query function remains callable.
- Updated the homepage, navigation, metadata, footer, responsive styles, README, and publication guidelines.
- No new runtime dependencies.

### Database migration

- Added `posts` and `post_comments` tables and indexes.
- Existing `releases`, likes, ratings, and release comments are unchanged.
- Seed records use `ON CONFLICT (slug) DO NOTHING` and may be added to an existing database by re-running `npm run db:setup`.
- Back up production PostgreSQL before applying schema changes.

### Verification status in this workspace

| Check | Status | Notes |
|---|---|---|
| ZIP extraction and project structure | Pass | All original project files extracted; existing release code retained |
| New route and component source creation | Pass | Post routes/pages, Creator Studio tabs, and public feed added |
| TypeScript/TSX syntax transpilation | Pass | 41 `.ts` / `.tsx` source files transpiled with zero syntax diagnostics |
| Full `npm run typecheck` | Blocked | Project dependencies are absent; `npm install` timed out. A separate structural TypeScript check using temporary framework declarations passed; dependency-backed checks remain unavailable |
| ESLint | Not verified | Requires installed dependencies |
| Next.js production build | Not verified | Requires installed dependencies |
| PostgreSQL migration/integration | Not verified | No live database credentials in the supplied archive |
| Browser/mobile visual QA | Not verified | Requires running application and browser session |

### Known limitations

- Public comments currently publish immediately; Creator Studio provides delete moderation, not a pre-approval queue.
- There is no distributed rate limiter or CAPTCHA in this version. Consider adding edge/database-backed rate limiting before high-traffic community launch.
- Visitors are anonymous; the site does not include registration, user profiles, direct messages, follows, or notifications.
- Release files are hosted externally. There is no upload service or binary storage.
- Post body is plain text with preserved line breaks; no Markdown editor or rich-text upload is included.
- Game modding content must comply with source licenses and copyright; the site does not inspect uploaded/downloaded binaries.

## v0.2.2 — Database query initialization hotfix

- Replaced lazy database Proxy with a plain `query()` function.
- API route handlers initialize PostgreSQL only when an actual request executes a query.
- Added deployment publishing helper. Build and live deployment remain the operator's responsibility.

## v0.2.1 — Vercel build hotfix

- Removed eager database connection initialization during build-time module import.
- Required runtime database setting remains `DATABASE_URL`.

## v0.2.0 — Soft Professional Redesign

- Redesigned homepage, cards, release details, responsive behavior, metadata, and Creator Studio with an off-white/sage visual system.
- Added release edit-in-place support and sorting.

## v0.1.0 — Initial Creator Library MVP

- Searchable category library, release detail, download redirect, likes, ratings, comments, admin login, release CRUD, and PostgreSQL schema.

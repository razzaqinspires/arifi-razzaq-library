# QA and changelog

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

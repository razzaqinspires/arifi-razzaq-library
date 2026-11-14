# Deployment, security, and operations

## Vercel or Node.js deployment

1. Push the project to a Git repository and import it as a Next.js application.
2. Provision/link the Neon project once from an authorized terminal; do not run `neon init` / `neon deploy` on each Vercel request or build.
3. Configure `DATABASE_URL`, `ADMIN_PASSWORD`, `SESSION_SECRET`, and `NEXT_PUBLIC_SITE_URL` in Vercel. Use the Neon pooled URI; set Production and Preview to separate appropriate branches.
4. Leave Vercel Build Command as `ARIFI_VERCEL_BUILD=1 npm run build`. The project build script automatically applies and verifies the idempotent application schema before `next build`.
5. Deploy and validate `/api/health` plus the relevant database-backed API workflows. See `AUTOMATED_STARTUP.md`.

Do not use deployment filesystem as permanent file storage. Store binaries on Cloudflare R2 or another S3-compatible provider and put the public/signed file URL in each release.

## Neon connection and deployment record

The designated Neon project and its console URL are documented in `NEON_SETUP.md`. The current code uses `pg` and a lazy, one-client `Pool` for Next.js Node.js route handlers. `npm start` and `npm run dev` bootstrap the application schema before starting a local server. Vercel's `ARIFI_VERCEL_BUILD=1 npm run build` hook bootstraps the schema before `next build`. Neon CLI authentication and infrastructure provisioning remain separate one-time owner-authorized steps. Do not store `DATABASE_URL` in tracked source. `.env` and `.env.local` are ignored by Git. See `AUTOMATED_STARTUP.md` and `NEON_SETUP.md` for exact setup and verification steps.

The public infrastructure section links to the Neon Console because the project owner requested that reference. The console URL itself is not a credential; never publish a connection string or password.

## Current security controls

- Admin password is read from a server-side environment variable.
- Admin cookie is HttpOnly, SameSite=Lax, Secure in production, HMAC-SHA256 signed, and expires after seven days.
- API SQL uses parameter binding. Public sort order uses a fixed allowlist and cannot inject a raw SQL fragment.
- Admin release create/update validates required fields, slug syntax, and HTTP/HTTPS URLs.
- Admin post create/update validates required fields, slug syntax, HTTP/HTTPS optional URLs, and field lengths.
- Public post endpoints only return `published = TRUE`; drafts are exposed only by authenticated admin endpoints.
- Post comments are rendered as text and are scoped to published posts.
- Public comment values are length limited and rendered as text; React escapes their content.
- Release deletion uses parameterized IDs and foreign-key cascading.

## Required hardening before broad public launch

- Add edge/API rate limiting for login, likes, ratings, release comments, post comments, and download counting.
- Add Cloudflare Turnstile or equivalent spam protection to comment submission.
- Consider pending moderation for new release and post comments. Both currently publish immediately and can be removed from Creator Studio.
- Add stronger admin authentication (OAuth/passkey) if there are multiple editors.
- Configure database backups and test restoration.
- Set a restrictive Content Security Policy and review allowed image/video hosts.
- Add monitoring for database errors and download redirects.
- If limiting abuse across cookie resets/devices matters, require verified user accounts; anonymous browser cookies cannot reliably identify a person.

## Operational notes

- Download requests are counted when the endpoint updates the database and redirects. The counter is not proof of a completed transfer; refreshes/repeated requests can increase it.
- The website does not proxy, scan, or verify the contents of external files. Only publish binaries you control or have permission to distribute.
- Keep secrets in hosting environment settings. Do not paste them into screenshots, source code, issues, or public documents.
- Back up PostgreSQL before destructive deletes or schema changes.

## Public content boundary

The public site is designed for work samples, learning notes, development journals, and community discussion—not private business records. Keep budgets, supplier details, personal information, customer data, credentials, tokens, and private infrastructure details out of public posts. For game/app modification, publish only original work or materials whose licenses explicitly allow redistribution; prefer patches, source mods, configuration, and tutorials over proprietary binaries.

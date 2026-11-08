# Deployment, security, and operations

## Vercel or Node.js deployment

1. Push the project to a Git repository and import it as a Next.js application.
2. Provision PostgreSQL reachable from the deployment.
3. Configure `DATABASE_URL`, `ADMIN_PASSWORD`, `SESSION_SECRET`, and `NEXT_PUBLIC_SITE_URL` as server environment variables.
4. Execute `db/schema.sql` once through the provider SQL console, or run `npm run db:setup` from a trusted environment with database access.
5. Deploy and validate the checklist in `QA_AND_CHANGELOG.md`.

Do not use deployment filesystem as permanent file storage. Store binaries on Cloudflare R2 or another S3-compatible provider and put the public/signed file URL in each release.

## Current security controls

- Admin password is read from a server-side environment variable.
- Admin cookie is HttpOnly, SameSite=Lax, Secure in production, HMAC-SHA256 signed, and expires after seven days.
- API SQL uses parameter binding. Public sort order uses a fixed allowlist and cannot inject a raw SQL fragment.
- Admin release create/update validates required fields, slug syntax, and HTTP/HTTPS URLs.
- Public comment values are length limited and rendered as text; React escapes their content.
- Release deletion uses parameterized IDs and foreign-key cascading.

## Required hardening before broad public launch

- Add edge/API rate limiting for login, likes, ratings, comments, and download counting.
- Add Cloudflare Turnstile or equivalent spam protection to comment submission.
- Consider pending moderation for new comments.
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

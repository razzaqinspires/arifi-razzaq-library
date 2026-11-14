# Architecture

## Application structure

The application is a Next.js App Router project with server API routes, client-side browsing/detail components, and PostgreSQL persistence.

### Public surfaces

- `/` — homepage with downloadable library, worklog feed, and community feed.
- `/library/[slug]` — release detail, file redirect, like/rating, and release comments.
- `/posts/[slug]` — public journal, community topic, or announcement with comments.
- `/admin` — password-protected Creator Studio.
- `/#portfolio` — project portfolio with evidence-based status labels.
- `/#templates` — website template catalogue; static previews are served from `/website-templates/`.
- `/#website-service` — Razzaq Ventures website consultation contact.
- `/#infrastructure` — project infrastructure overview and Neon Console reference.

### Data domains

`releases` remains the downloadable-content entity. It owns version, download URL, file metadata, video, changelog, likes, ratings, and release comments.

`posts` is a separate editorial entity for journal entries, community topics, and announcements. It owns title, slug, excerpt, body, kind, category, tags, optional cover/reference URL, featured status, publication status, and timestamps. `post_comments` stores comments for those posts.

The separation prevents a process note or community question from needing a fake download URL/version just to be published. Both domains share the public site design but have independent APIs and data tables.

### Main API routes

| Method | Route | Purpose |
|---|---|---|
| GET | `/api/health` | Runtime health and PostgreSQL connectivity |
| GET | `/api/releases` | Search/filter/sort downloadable releases |
| GET | `/api/releases/[slug]` | Release detail and engagement |
| GET | `/api/posts` | Search/filter public posts |
| GET | `/api/posts/[slug]` | Public post detail and comments |
| POST | `/api/posts/[slug]/comments` | Add a post comment |
| GET/POST | `/api/admin/posts` | Admin list and create posts |
| PUT/DELETE | `/api/admin/posts/[id]` | Update or remove a post |
| GET | `/api/admin/post-comments` | Admin post-comment moderation list |
| DELETE | `/api/admin/post-comments/[id]` | Remove a post comment |

Release endpoints and admin routes from the original library remain in place.

### Security and privacy

- Admin session uses a signed HMAC token in an HTTP-only cookie.
- Admin routes call `isAdmin()` before database mutation/listing.
- Post input is trimmed, length-limited, slug-validated, and optional URLs are restricted to HTTP(S).
- Public queries return published posts only. Drafts are visible only through admin endpoints.
- Visitor identifiers are anonymous cookies; they are not verified user accounts.
- Do not publish private business records, credentials, personal data, or files whose distribution is not authorized.

### Database

The connection pool is initialized lazily by `lib/db.ts` at the first actual query, not during build-time import. It is sized to one connection per warm Vercel function instance and must use the Neon pooled PostgreSQL URI. `db/schema.sql` defines both domains and idempotent public starter posts. Locally, `npm start` / `npm run dev` apply and verify the schema before starting Next.js. During a Vercel deployment, `npm run build` applies and verifies the schema before `next build`; runtime API handlers connect lazily. `/api/health` checks live database connectivity without exposing secrets. See `docs/AUTOMATED_STARTUP.md` and `docs/NEON_SETUP.md`.

### Public templates and client work

- `public/website-templates/` serves plain HTML/CSS previews that work without the Library database.
- `website-templates/` holds the corresponding source and MIT notice for the original static templates.
- `projects/client-work/heru-bali-tour/` preserves the HERU BALI TOUR client delivery source; it is not covered by the public template license.

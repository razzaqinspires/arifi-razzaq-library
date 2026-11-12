# Setup and content workflow

## Local setup

1. Install Node.js 22.16+, npm 10+, and PostgreSQL 15+.
2. Copy `.env.example` to `.env` and set `DATABASE_URL`, `ADMIN_PASSWORD`, `SESSION_SECRET`, and `NEXT_PUBLIC_SITE_URL`.
3. Create a database if needed.
4. Run `npm install` and `npm run db:setup`.
5. Run `npm run dev` and open `http://localhost:3000`.
6. Open `/admin` to manage public material.

## Publishing releases

Use **Library & file** in Creator Studio for source, scripts, apps, utilities, mod tools, and versioned downloadable assets. Include release version, file size/name, valid download URL, license/usage notes in the description, and changelog. The system stores an external file URL and tracks download redirects; it does not upload binaries.

## Publishing journals and community posts

Use **Jurnal & post**. Select Journal, Community, or Announcement, then complete title, slug, excerpt, content, category, and tags. Optional cover and external reference URLs must be HTTP(S). Turn off publication to keep a draft; turn it on to make the post visible at `/posts/[slug]` and on the homepage.

Use journals for process notes and work history. Use community posts for questions and topic-based discussions. Separate paragraphs with blank lines; plain text line breaks are preserved on the public page.

## Comments

Comments are available on release pages and post pages. They are posted immediately and can be deleted from Creator Studio → Comments. This is not a pre-moderation or user-account system.

## Existing database upgrade

Run `npm run db:setup` after backing up an existing database. New posts tables and starter posts are created idempotently. Existing release content and engagement records are preserved.

## Publication safety

Review `PUBLICATION_GUIDELINES.md` before publishing. In particular, do not publish private costs, credentials, tokens, personal data, client data, proprietary game binaries, or third-party content without redistribution rights.

# Setup and content workflow

## Requirements

- Node.js 22.16 or newer.
- npm 10 or newer.
- PostgreSQL 15 or newer.
- Public HTTP/HTTPS URLs for downloadable files and optional image/video resources.

## Environment variables

| Variable | Required | Purpose |
|---|---:|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `ADMIN_PASSWORD` | Yes | Creator Studio password |
| `SESSION_SECRET` | Yes | HMAC key; use at least 32 random characters |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Canonical site URL for metadata |
| `DATABASE_SSL` | Optional | Set `false` only for a local non-SSL database; otherwise leave unset |

## First-time installation

```bash
cp .env.example .env
nvim .env
createdb arifi_library
npm install
npm run db:setup
npm run dev
```

Create the session key using `openssl rand -base64 48`. Replace all sample values with private values. Do not commit `.env`.

## Publish a release

1. Open `/admin` and sign in.
2. Add the release title. The slug is generated from its title until manually adjusted.
3. Add a short summary and a full description. Include purpose, supported environment, installation steps, dependencies, and known caveats.
4. Select a category and set the version.
5. Paste a public direct-file URL. Optional fields include filename, file size, YouTube URL, thumbnail URL, tags, and changelog.
6. Mark featured when the release should be highlighted.
7. Publish, then verify the public card and detail page.

## Edit an existing release

1. In Creator Studio, locate the item under **Konten terbit**.
2. Select **Edit**. The existing metadata, tags, and changelog load into the form.
3. Update the version, content details, URL, thumbnail, or changelog.
4. Select **Simpan perubahan**. The update preserves the release ID, likes, ratings, comments, and download count.

The update endpoint validates slug, required text fields, and HTTP/HTTPS URLs. It updates `updated_at`. It does not create a separate version-history table; version history is represented by the current `version` value and manually maintained changelog.

## Remove content

Select **Hapus** and confirm the warning. Deleting a release cascades to its likes, ratings, and comments. This action is destructive; export or back up the database first when the data matters.

## Neovim quick guide

- Open a file: `nvim .env` or `nvim app/page.tsx`.
- Press `i` to enter insert mode.
- Press `Esc` to return to normal mode.
- Save: `:w` then Enter.
- Save and exit: `:wq` then Enter.
- Exit without saving: `:q!` then Enter.

## Useful commands

```bash
npm run dev       # development server
npm run lint      # ESLint
npm run typecheck # TypeScript check
npm run build     # production build
npm start         # run production build
npm run db:setup  # initial PostgreSQL schema
```

# Neon infrastructure — Arifi Razzaq Library

**Last recorded:** 2026-11-14  
**State:** Project details recorded; CLI authentication, service provisioning, runtime wiring, and end-to-end validation remain pending.

## Console and project record

- Console: <https://console.neon.tech/app/projects/bold-pond-23834459/branches/br-fragrant-feather-azns5f5c>
- Organization ID: `org-gentle-smoke-00495930`
- Project ID: `bold-pond-23834459`
- Target branch: `production`
- Requested services: `postgres`, `auth`, `ai-gateway`, `object-storage`, `functions`, `realtime`

This document records the identifiers and setup request supplied by the project owner. It does not contain the database password, connection URI, API key, or other secrets.

## Provisioning

From the root of this Next.js project, with a Neon account that has permission to modify the project:

```bash
npm i -g neon@latest
# If global installation is unavailable, use npx neon@latest.

neon init -y --org-id org-gentle-smoke-00495930 \
  --project-id bold-pond-23834459 \
  --branch production \
  --services postgres,auth,ai-gateway,object-storage,functions,realtime

neon deploy
```

A convenience script is included:

```bash
npm run neon:setup
```

If Neon opens a browser sign-in, complete it with the account that owns or has access to the project. The current Neon CLI documentation uses `neon auth` for browser authentication; if the installed CLI reports a different login command, follow the installed CLI's help/output. The CLI may also be used through `npx neon@latest` if a global binary is unavailable.

After provisioning, verify `.env.local` (or `.env`) contains the variables Neon generated. Never paste actual database connection strings or tokens into public posts, source control, screenshots, or this documentation. `.env`, `.env.local`, and `.neon` are ignored by Git.

## Driver and runtime choice

The Library currently uses `pg` (`node-postgres`) through a lazily initialized `Pool` in `lib/db.ts`. Its Next.js route handlers use the default Node.js runtime; they do not declare the Edge runtime. Keep the handlers on Node.js and use the Neon pooled PostgreSQL connection URI for a serverless Vercel deployment. `DATABASE_URL` must come from the Neon CLI/Console, not from a guessed hostname.

Do not use the placeholder command `psql -h pg.neon.tech` as a complete connection instruction: it omits the actual endpoint, database, username, and credential. Use the connection string provided by Neon, for example:

```bash
psql "$DATABASE_URL"
```

or use the Neon CLI's linked-project command:

```bash
neon psql
```

If a future app route is deliberately deployed on the Edge runtime, evaluate `@neondatabase/serverless` for that route instead of attempting to use a standard TCP-only Node PostgreSQL driver in an Edge environment.

## Apply the Library schema

The project uses the `pg` dependency and keeps its schema in `db/schema.sql`. After Neon has populated the environment file, run:

```bash
npm run db:setup
```

The `db:setup` npm script loads `.env` and `.env.local` (if present) before executing `scripts/setup-db.mjs`. Back up production data before any future schema changes, even though current schema setup uses idempotent `CREATE TABLE IF NOT EXISTS` statements and seed rows with `ON CONFLICT DO NOTHING`.

## Required verification checklist

- [ ] `neon status` identifies the expected project and production branch.
- [ ] `neon config status` or equivalent CLI output confirms requested services actually exist.
- [ ] `.env.local` contains generated database variables; secret values remain local.
- [ ] `npm run db:setup` completes successfully against the intended branch.
- [ ] `npm run lint` passes.
- [ ] `npm run typecheck` passes.
- [ ] `npm run build` passes.
- [ ] The app starts with `npm start` and public pages load.
- [ ] Database-backed API routes complete successful read/write tests.
- [ ] Each provisioned Neon service is wired into an application feature and tested before being described as active.
- [ ] Vercel has the required server-side environment variables set separately; local `.env.local` is not automatically the Vercel environment.

## Scope note

Provisioning a Neon service does not automatically integrate it into application code. The current Library's database-backed features use PostgreSQL. Neon Auth, AI Gateway, Object Storage, Functions, and Realtime must each be connected to a defined feature and tested before those integrations can be marked complete. Avoid enabling or charging for unused services without reviewing plan and usage limits.

## Official references

- Neon CLI update (Aug 25, 2026): <https://neon.com/blog/just-landed-in-the-neon-cli>
- Neon backend update (Nov 10, 2026): <https://neon.com/blog/whats-new-with-the-neon-backend>
- `neon.ts` infrastructure-as-code overview: <https://neon.com/blog/introducing-neon-ts>
- Neon serverless driver background: <https://neon.com/blog/how-to-use-postgres-at-the-edge>

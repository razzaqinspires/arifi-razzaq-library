# Automated startup — Arifi Razzaq Library

**Version:** 0.5.0  
**Goal:** one-command local startup and automatic PostgreSQL schema preparation during Vercel builds.

## One command on a local machine

After dependencies are installed and `.env.local` contains a valid Neon pooled `DATABASE_URL` plus the application secrets, run:

```bash
npm install
npm start
```

`npm start` performs these steps in order:

1. Loads `.env` and `.env.local` (without printing their values).
2. Checks that `DATABASE_URL` exists and has a PostgreSQL URL scheme.
3. Connects to PostgreSQL and verifies the connection.
4. Acquires a PostgreSQL advisory transaction lock so two starts do not apply the bootstrap simultaneously.
5. Applies `db/schema.sql` in one transaction. The current schema uses idempotent table/index creation and seed inserts with conflict handling.
6. Verifies the core tables and closes the migration pool.
7. If `.next/BUILD_ID` is missing, runs `next build`; set `ARIFI_REBUILD_ON_START=true` to force a fresh local production build. Then starts `next start`.

For development, `npm run dev` uses the same database bootstrap and then starts `next dev` without a production build. If the database cannot be reached or the schema cannot be applied, the app is not started; this avoids appearing healthy while database features are unavailable.

Useful diagnostics:

```bash
npm run db:check
curl http://localhost:3000/api/health
```

The health route returns HTTP 200 only when the app can query PostgreSQL. It returns HTTP 503 with a generic database-unavailable status when the database is unreachable; it does not expose connection strings or raw database errors.

## One deploy flow on Vercel

Connect the repository to Vercel and keep the Build Command from `vercel.json`: `ARIFI_VERCEL_BUILD=1 npm run build`. The explicit marker makes the database bootstrap run even when Vercel system environment variables are not exposed. `scripts/build.mjs` then runs:

1. The same idempotent and lock-protected PostgreSQL bootstrap using the build's `DATABASE_URL`.
2. The regular `next build` command.

If the database connection or schema verification fails, the Vercel build fails instead of publishing an app whose required database is unavailable. Set `ARIFI_DB_AUTO_MIGRATE=false` only when a separately managed migration pipeline has been configured and verified.

### Required Vercel environment variables

Set these under Project → Settings → Environment Variables:

- `DATABASE_URL`: Neon pooled PostgreSQL connection URI (host includes `-pooler` where the pooled endpoint is provided).
- `ADMIN_PASSWORD`: a long, unique password for Creator Studio.
- `SESSION_SECRET`: a cryptographically random secret of at least 32 characters.
- `NEXT_PUBLIC_SITE_URL`: the public Library URL.

Set values separately for Production and Preview. Production must target the Neon production branch. Preview should target a separate Neon branch/database so preview builds cannot migrate production data. Do not copy a local `.env.local` file into Git. Never commit or display the real connection string or secret values.

After these one-time settings are present, each Vercel build performs the schema bootstrap automatically before Next.js compilation. Database-backed route handlers then connect lazily at runtime through the Node.js `pg` pool, using one client per warm function instance and the pooled connection URI.

## Important: Neon Console / CLI is not an application startup process

The Neon Console is the provider's management interface; it is not a database process that should be launched by `npm start` or by each Vercel function. The Neon database is a managed service. `neon init` links the repository to the selected Neon project and can create the `neon.ts` configuration; `neon deploy` provisions the declared infrastructure. Those are owner-authorized infrastructure operations, not per-request or per-start hooks. Authenticate with `neon auth`, run them once from an authorized terminal, review the service plan, and keep the Neon API credentials out of the repository.

The Library's app startup only verifies/connects to the existing PostgreSQL service and applies its application schema. It does not provision Neon Auth, AI Gateway, Object Storage, Functions, or Realtime. Those services require separate feature implementation, environment configuration, and end-to-end validation before they can be marked active.

Vercel deploys Next.js using its build and function runtime. It does not keep a user-controlled `npm start` process running as a permanent server. Therefore, `npm start` is the single-command local Node.js startup; Vercel uses the build hook plus serverless Node.js functions.

## Operational guarantees and boundaries

- No database URI, password, or provider API key is written into tracked files or logs.
- Current bootstrap is repeatable and serializes concurrent bootstrap calls with a PostgreSQL advisory lock.
- This schema bootstrap is not a substitute for a versioned migration framework for future destructive/structural changes. Add explicit migrations and a tested backup/rollback plan before those changes.
- A successful build proves build-time DB connection and schema preparation. It does not by itself prove every database-backed API workflow; test `/api/health` and the relevant CRUD flows after deployment.
- The Neon Console project/branch is recorded in `NEON_SETUP.md`; provisioning remains pending until the owner runs the authenticated CLI workflow and verifies the result.

## Official documentation

- Vercel system environment variables (`VERCEL`, `VERCEL_ENV`): <https://vercel.com/docs/environment-variables/system-environment-variables>
- Vercel build configuration: <https://vercel.com/docs/builds/configure-a-build>
- Neon and Next.js on Vercel, including pooled connection endpoints: <https://neon.com/docs/get-started-with-neon/vercel>
- Neon CLI `init` lifecycle: <https://neon.com/docs/reference/cli-init>
- Next.js Node.js deployment scripts: <https://nextjs.org/docs/app/getting-started/deploying>

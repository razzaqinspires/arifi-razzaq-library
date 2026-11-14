# Working rules for coding agents

When modifying Arifi Razzaq Library or related Razzaq Ventures projects:

1. Preserve existing source files, project structure, attribution, provenance, and licenses. Do not silently replace or omit previously contributed work.
2. Update `README.md`, the relevant document under `docs/`, and `docs/WORKLOG.md` whenever code, infrastructure, or project status changes.
3. Record the current date, version, changed paths, reason, test commands, and actual results. Never claim a build, deployment, database migration, or end-to-end test passed unless it was executed and its output was observed.
4. Keep private values out of tracked files: passwords, `DATABASE_URL`, API keys, tokens, session secrets, private customer records, and unapproved commercial data. Use `.env.example` placeholders only.
5. Keep the static starter website templates runnable offline. Mark starter concepts separately from completed client work.
6. Treat `projects/client-work/` as client-delivery source. Do not relicense, redistribute, or reuse client brand assets/source without permission.
7. For Neon operations, use the recorded target project and branch in `docs/NEON_SETUP.md`. Authentication and provisioning require an authorized account session. Review planned services and costs before provisioning. Do not write secrets to the repository.
8. Keep app database access on the Node.js runtime unless a deliberate Edge migration is implemented and verified. Use the Neon pooled connection URL for hosted serverless deployment with the current `pg` pool. `npm start` / `npm run dev` must bootstrap and verify the database before local startup; Vercel `ARIFI_VERCEL_BUILD=1 npm run build` must run the idempotent bootstrap before `next build`. Never run Neon infrastructure provisioning from app startup or a Vercel request.
9. Before deployment, run lint, typecheck, build, database setup/migration as appropriate, and the documented smoke tests. Report every skipped or failed test.
10. Prefer explicit, small migrations and preserve backward compatibility with existing database data. Use advisory locking for automatic bootstrap and keep Preview database URLs isolated from Production.

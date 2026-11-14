# Arifi Razzaq Library — Worklog

Catatan ini adalah rekam jejak perubahan proyek. Status dan hasil tes dicatat sesuai bukti yang tersedia; aktivitas yang belum diverifikasi tidak ditulis sebagai selesai.

## 2026-11-14 — Library portfolio, konsultasi website, templates, and Neon record

**Scope:** Expand the public Library into a portfolio and website-development consultation hub while retaining the existing Library, worklog, community feed, and Creator Studio.

**Changes made in source:**

- Added portfolio cards for HERU BALI TOUR, WHISKAY-BOT, and AISYAH × NEXORA with status labels that distinguish a published site from ongoing software projects.
- Added a website-development consultancy section with WhatsApp contact `+62 831-9390-5842` and a prefilled inquiry link.
- Added a templates section for Tour & Travel, Company Profile, and Product & Brand Landing Page. HERU BALI TOUR is the live example; the other two are explicitly labelled starter concepts.
- Added offline-friendly HTML/CSS starter previews for Company Profile and Product Landing Page under `public/website-templates/`, plus a standalone template catalogue index.
- Preserved the HERU BALI TOUR source snapshot under `projects/client-work/heru-bali-tour/`, added a provenance record and SHA-256 manifest, and recorded the deployed URL `https://heru-bali-tour-website.vercel.app/`.
- Added infrastructure references for Vercel, Neon PostgreSQL, and WHISKAY-BOT.
- Added Neon project/branch metadata and a setup checklist in `docs/NEON_SETUP.md`; no password or database URI is stored.
- Added `scripts/setup-neon.sh` and `npm run neon:setup` as an explicit, owner-authorized setup workflow, with `npx` fallback if global CLI installation fails. It is not executed automatically during build.
- Updated the database setup script command to accept both `.env` and `.env.local`, and tightened Git ignore rules for environment files, Vercel local state, and private keys.
- Added repository-level operating rules in `AGENTS.md` so future updates maintain documentation, worklog, source provenance, and test records.

**Known project references:**

- HERU BALI TOUR public website: `https://heru-bali-tour-website.vercel.app/`.
- HERU BALI TOUR contact configured in the client deliverable: `082322589437`.
- Razzaq Ventures website consultation: `https://wa.me/6283193905842`.
- Neon Console: `https://console.neon.tech/app/projects/bold-pond-23834459/branches/br-fragrant-feather-azns5f5c`.
- Neon project ID: `bold-pond-23834459`; branch: `production`.
- WHISKAY-BOT repository: `https://github.com/razzaqinspires/whiskay-bot`.

**Neon state:** Project identifiers and owner-provided CLI setup instructions recorded. Neon CLI authentication, `neon init`, `neon deploy`, database URL retrieval, Vercel environment setup, schema migration against the real branch, service-specific application wiring, and end-to-end tests are not yet verified in this working environment. The actual Neon account login and infrastructure deployment must be completed from an authorized interactive shell.

**Tests:**

- HTML parser checks passed for the template catalogue, the two new static templates, and the stored HERU BALI TOUR page.
- `package.json` JSON parse passed.
- `node --check` passed for `scripts/setup-db.mjs` and the HERU BALI TOUR booking script `projects/client-work/heru-bali-tour/app.js`.
- TypeScript transpile syntax checks passed for `app/page.tsx`, `app/layout.tsx`, `components/business-showcase.tsx`, `components/site-header.tsx`, and `components/site-footer.tsx` (zero syntax diagnostics).
- `bash -n scripts/setup-neon.sh` passed (no output).
- `npm install` was attempted but failed because the npm registry hostname could not resolve in this environment (`EAI_AGAIN registry.npmjs.org`). No dependencies or lockfile were installed.
- Global `tsc --noEmit` was attempted but cannot typecheck the app because the project dependencies and type declarations (`next`, `react`, `pg`, `@types/node`) are unavailable; these are dependency-resolution errors, not a completed typecheck.
- ESLint, dependency-backed typecheck, production build, browser tests, and Neon-backed API tests remain pending. Vercel deployment was not performed: the connected Vercel context returned no accessible teams/projects in this session.

## 2026-11-12 — v0.3.0 worklog and community expansion

- Added separate editorial posts and community discussions while retaining release/library data.
- Added post comments and moderation endpoints, Creator Studio management, content taxonomy, and publication documentation.
- Added architecture, deployment/security, workflow, and QA documentation.

## Prior baseline

The original Library supported downloadable releases, detail pages, engagement actions, anonymous visitor comments, and a password-protected Creator Studio. Existing source and documented behavior should be preserved unless a specific migration is required.

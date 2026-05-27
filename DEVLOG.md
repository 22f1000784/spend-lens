# DEVLOG — SpendLens

Daily development log for the Credex Web Dev Internship Assignment.
Each entry is git-verifiable — commits are referenced by hash.

---

## Day 1 — 2026-05-21
**Hours worked:** 4
**What I did:**
- Read the Credex assignment brief in full. Identified the core value proposition: founders don't know if they're overpaying on AI tools.
- Decided on the name "SpendLens" — like a lens that focuses on spend clarity.
- Evaluated LLM options: tried Anthropic Claude API (billing verification issues) → switched to Groq (llama-3.1-8b-instant, free tier, fast).
- Set up Supabase project, designed schema with two tables: `audits` (stores results, referenced by shareable UUID) and `leads` (stores captured emails).
- Set up Resend for transactional email.
- Tested all API connections with standalone Python scripts — Groq ✅, Supabase ✅, Resend ✅.
- Wrote User Interview Guide — need to conduct 3 real interviews by May 24.
**What I learned:**
- Switched to Groq due to Anthropic API access setup issues, which works similarly for summaries.
- Deciding on a database model early simplifies full-stack development.
**Blockers / what I'm stuck on:** None.
**Plan for tomorrow:** Scaffold the React + Vite client and the Express server, write core audit engine.

---

## Day 2 — 2026-05-22
**Hours worked:** 6
**What I did:**
- Scaffolded React + Vite + TypeScript client with Tailwind CSS v4.
- Set up Express + TypeScript server with all routes: `/api/audit`, `/api/leads`.
- Built the core **audit engine** (`server/src/lib/auditEngine.ts`) — pure TypeScript, no AI, deterministic rules (plan right-sizing, alternative suggestions, API overspend credits).
- Built **Groq wrapper** with graceful fallback — if API fails, uses template summary.
- Built **Resend email** with dark-themed HTML template, Credex CTA for high-savings users.
- Built the full **React frontend** (Home page, AuditResult page, Lead capture modal with honeypot bot protection, localStorage state persistence).
- Connected to GitHub, made first commits.
**What I learned:**
- Tailwind v4 uses `@import "tailwindcss"` in CSS, which differs from older versions.
- Vite project templates sometimes require manual setup of React plugin configurations depending on the options selected.
**Blockers / what I'm stuck on:** None.
**Plan for tomorrow:** Write Vitest unit tests for the audit engine to verify accuracy.

---

## Day 3 — 2026-05-23
**Hours worked:** 3
**What I did:**
- Set up Vitest in the server package with `vitest` ^4.1.7.
- Wrote 9 unit tests for the audit engine covering all rule branches: plan right-sizing, alternative tools, annual savings calculations, optimal configuration path, high savings threshold ($500+/mo), API overspend detection (>$100/mo).
- Fixed unused `summaryRouter` import in server entry point.
- Ran all 9 tests and verified they are passing.
**What I learned:**
- Vitest provides native TypeScript support and is extremely fast compared to Jest.
- Structuring tests alongside rule classifications ensures the audit logic is easily reviewable.
**Blockers / what I'm stuck on:** None.
**Plan for tomorrow:** Remove boilerplate code, compile documentation files, and conduct user interviews.

---

## Day 4 — 2026-05-24
**Hours worked:** 5
**What I did:**
- Removed Vite scaffold boilerplate files (main.ts, counter.ts, default SVG assets).
- Created `ARCHITECTURE.md` explaining data flow, database schema, design rationale.
- Added GitHub Actions workflow (`.github/workflows/test.yml`) to typecheck client and run server tests.
- Fixed README test instructions.
- Conducted the first two user interviews (documented in `USER_INTERVIEWS.md`).
**What I learned:**
- Users generally have clear feedback about feature downgrades, stating that understanding what feature they'll lose is as important as the savings amount.
- Untracked files in Git can go unnoticed if not explicitly checked with `git status` or `git ls-files`.
**Blockers / what I'm stuck on:** None.
**Plan for tomorrow:** Run end-to-end integration tests, fix UI transitions, and conduct the final user interview.

---

## Day 5 — 2026-05-25
**Hours worked:** 4
**What I did:**
- Ran full end-to-end testing: form submission → audit result → share URL → lead capture → email delivery.
- Verified Groq API fallback behavior.
- Tested shareable URLs.
- Conducted the third user interview (VP of Engineering at Series B SaaS) which validated the Credex API credits value proposition.
- Verified API rate limiting and form honeypot protections.
- Fixed Safari modal transition animation jank by adding `will-change: transform`.
- Added loading spinner to shared audit page to prevent "Audit not found" flash.
**What I learned:**
- Safari has specific rendering rules for modal overlay fades, requiring optimization properties for smooth movement.
- Large company spend structures are highly receptive to the concept of bulk credits.
**Blockers / what I'm stuck on:** None.
**Plan for tomorrow:** Create and compile the remaining documentation files (Reflection, Prompts, GTM, Economics, Metrics, etc.).

---

## Day 6 — 2026-05-26
**Hours worked:** 6
**What I did:**
- Created and finalized the rest of the documentation files: `REFLECTION.md`, `TESTS.md`, `PROMPTS.md`, `GTM.md`, `ECONOMICS.md`, `USER_INTERVIEWS.md`, `LANDING_COPY.md`, `METRICS.md`.
- Enhanced Open Graph metadata tags (`og:site_name`, `og:locale`, and Twitter card properties).
- Added SEO meta tags to index.html.
- Updated README to reference all documentation files.
**What I learned:**
- Detailed unit economics math is key to proving entrepreneurial product validity.
- Open Graph tags must be thoroughly formatted to ensure preview cards display nicely on social media platforms.
**Blockers / what I'm stuck on:** None.
**Plan for tomorrow:** Final client deployment, accessibility check, CI validation, and submission preparation.

---

## Day 7 — 2026-05-27
**Hours worked:** 5
**What I did:**
- Fixed untracked CI file issue by staging and committing the workflow file.
- Ran accessibility improvements across the React client components (added role attributes, aria-labels, semantic HTML markup, screen reader texts).
- Updated README with Quick Start and Deployment guidelines.
- Deployed frontend to Vercel and backend to Render.
- Resolved TypeScript tsconfig JSX configuration error and removed unused `TOOL_ACTION_LABELS` variable in client source code.
- Added SPA routing rewrite rules to `vercel.json` to prevent 404 route errors on sub-links.
**What I learned:**
- Vercel deployments require explicit fallback rewrites for client-routed single-page apps to avoid 404 errors.
- TypeScript compiler configurations on local environments must perfectly match CI/CD build environments to prevent deployment failures.
**Blockers / what I'm stuck on:** None.
**Plan for tomorrow:** Finalize repository status and submit the Google Form.

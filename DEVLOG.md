# DEVLOG — SpendLens

Daily development log for the Credex Web Dev Internship Assignment.
Each entry is git-verifiable — commits are referenced by hash.

---

## Day 1 — May 21, 2026

**Goal:** Problem discovery, API setup, tech stack decisions

**What I did:**
- Read the Credex assignment brief in full. Identified the core value proposition: founders don't know if they're overpaying on AI tools.
- Decided on the name "SpendLens" — like a lens that focuses on spend clarity.
- Evaluated LLM options: tried Anthropic Claude API (billing verification issues) → switched to Groq (llama-3.1-8b-instant, free tier, fast).
- Set up Supabase project, designed schema with two tables: `audits` (stores results, referenced by shareable UUID) and `leads` (stores captured emails).
- Set up Resend for transactional email.
- Tested all API connections with standalone Python scripts — Groq ✅, Supabase ✅, Resend ✅.
- Wrote User Interview Guide — need to conduct 3 real interviews by May 24.

**Decisions made:**
- Groq instead of Anthropic (faster setup, same quality output for this use case)
- Supabase over Firebase (better PostgreSQL support, RLS policies, free tier generous)
- React + Vite + TypeScript over Next.js (simpler deployment separation — no SSR needed here)

**Blockers:** None. APIs all working.

---

## Day 2 — May 22, 2026

**Goal:** Full project scaffold, audit engine, core UI

**What I did:**
- Scaffolded React + Vite + TypeScript client with Tailwind CSS v4
- Set up Express + TypeScript server with all routes: `/api/audit`, `/api/leads`
- Built the core **audit engine** (`server/src/lib/auditEngine.ts`) — pure TypeScript, no AI, deterministic rules:
  - Plan right-sizing: flags Team plans for ≤2 users
  - Alternative tool suggestions by use case
  - API overspend detection (flags for Credex credits)
- Built **Groq wrapper** with graceful fallback — if API fails, uses template summary
- Built **Resend email** with dark-themed HTML template, Credex CTA for high-savings users
- Built the full **React frontend**:
  - Home page with hero, spend form (8 tools, plan/seat/spend inputs)
  - Audit result page with savings hero, per-tool breakdown, AI summary, share button
  - Lead capture modal (appears 2 seconds after results, honeypot bot protection)
  - localStorage persistence across page reloads
- Connected to GitHub, made first commits

**Challenges:**
- Vite scaffold didn't include React by default — had to add `@vitejs/plugin-react` and React packages manually
- Tailwind v4 uses `@import "tailwindcss"` not `@tailwind base` — updated style.css accordingly

**Tomorrow (Day 3):** Write Vitest tests for audit engine, add tsconfig fixes, test full flow end-to-end

---

## Day 3 — May 23, 2026

**Goal:** Write tests for audit engine, verify server stability

**What I did:**
- Set up Vitest in the server package with `vitest` ^4.1.7
- Wrote 9 unit tests for the audit engine covering all rule branches:
  - Plan right-sizing (Team plan overkill for ≤2 users, Claude Team→Pro downgrade)
  - Alternative tool suggestions (Cursor→Windsurf, Copilot→Cursor Free)
  - Annual savings calculation consistency
  - "Spending well" path (zero savings for optimal setups)
  - High-savings Credex CTA threshold ($500+/mo)
  - API overspend detection (>$100/mo flagging)
- Fixed unused `summaryRouter` import in server entry point
- All 9 tests passing ✅

**Decisions made:**
- Vitest over Jest — native TypeScript support, faster execution, Vite-compatible
- Test structure mirrors the audit engine's three rule categories for clarity

**Blockers:** None. Need to do E2E testing tomorrow.

---

## Day 4 — May 24, 2026

**Goal:** Documentation, CI pipeline, project cleanup, user interviews

**What I did:**
- Removed Vite scaffold boilerplate files (main.ts, counter.ts, default SVG assets) — leftover from `create-vite` init
- Created `ARCHITECTURE.md` — system diagram, request flows (audit creation, lead capture, shared audit retrieval), database schema, design rationale, security considerations
- Added GitHub Actions CI workflow (`.github/workflows/test.yml`) — runs server unit tests + client type checking on push/PR to main
- Updated DEVLOG with Day 3 and Day 4 entries
- Fixed README test instructions (tests are in server, not client)
- Conducted user interviews (see USER_INTERVIEWS.md)

**Decisions made:**
- CI runs two jobs: server tests + client `tsc --noEmit` type check (no client tests yet, but type safety is verified)
- Architecture doc uses ASCII art diagrams instead of images — renders on GitHub without extra tooling

**Tomorrow (Day 5):** E2E manual testing, fix any bugs found, polish UI transitions

---

## Day 5 — May 25, 2026

_To be written after work is done._

---

## Day 6 — May 26, 2026

_To be written after work is done._

---

## Day 7 — May 27, 2026

_Final polish, submission._

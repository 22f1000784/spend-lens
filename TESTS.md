# Tests — SpendLens

Test strategy, test files, coverage details, and run instructions.

---

## Test Strategy

SpendLens uses a **focused unit testing approach** on the business-critical audit engine. Since the audit engine is pure TypeScript with no external dependencies, it's fully deterministic and highly testable. AI generation (Groq) and external services (Supabase, Resend) are not unit-tested — they have graceful fallbacks instead.

### Why we focus on the audit engine:
1. **It's the core business logic** — wrong recommendations destroy user trust
2. **It's deterministic** — same input always produces same output
3. **It has clear boundaries** — pure function, no I/O, no side effects
4. **Edge cases matter** — off-by-one on seat counts, $0 savings thresholds

---

## Test Framework

| Property | Value |
|---|---|
| **Framework** | Vitest v4.1.7 |
| **Language** | TypeScript |
| **Location** | `server/src/__tests__/auditEngine.test.ts` |
| **Run command** | `cd server && npm test` |
| **Watch mode** | `cd server && npm run test:watch` |

---

## Test List

### 1. Plan Right-Sizing Tests

| # | Test Name | What it Verifies |
|---|---|---|
| 1 | `flags Team plan as overkill for a 2-person team on Cursor` | Team plan ($40/seat) triggers downgrade to Pro ($20/seat) when teamSize ≤ 2 |
| 2 | `flags Claude Team plan as overkill for solo user` | Claude Team ($30) → Pro ($20), savings = $10 |

### 2. Alternative Tool Suggestions

| # | Test Name | What it Verifies |
|---|---|---|
| 3 | `suggests Windsurf Pro as cheaper alternative to Cursor Pro for coders` | Cursor Pro ($20) → Windsurf Pro ($15) when use case is coding |
| 4 | `does not suggest alternatives when savings would be ≤$5` | Filters out noise — only recommends when savings > $5/mo |

### 3. Annual Savings Calculation

| # | Test Name | What it Verifies |
|---|---|---|
| 5 | `annual savings equals monthly savings × 12` | Annual calculation consistency |

### 4. Spending Well (No Waste)

| # | Test Name | What it Verifies |
|---|---|---|
| 6 | `suggests Cursor Free as alternative to GitHub Copilot Business for coders` | Switch recommendation with significant savings |
| 7 | `returns zero savings for tool on cheapest viable plan` | No false positives — large teams on Team plans get "keep" |

### 5. High-Savings Credex CTA

| # | Test Name | What it Verifies |
|---|---|---|
| 8 | `attaches Credex angle for OpenAI API spend over $100/mo` | API overspend detection triggers Credex recommendation |
| 9 | `identifies $500+/mo savings threshold for high-savings flag` | Verifies high-savings threshold logic for CTA display |

---

## Running Tests

### All tests (CI mode)
```bash
cd server
npm test
```

### Watch mode (development)
```bash
cd server
npm run test:watch
```

### Expected output
```
 ✓ server/src/__tests__/auditEngine.test.ts (9 tests) 12ms
   ✓ Audit Engine — Plan Right-Sizing
     ✓ flags Team plan as overkill for a 2-person team on Cursor
     ✓ flags Claude Team plan as overkill for solo user
   ✓ Audit Engine — Alternative Tool Suggestions
     ✓ suggests Windsurf Pro as cheaper alternative to Cursor Pro for coders
     ✓ does not suggest alternatives when savings would be ≤$5
   ✓ Audit Engine — Annual Savings Calculation
     ✓ annual savings equals monthly savings × 12
   ✓ Audit Engine — Spending Well (No Waste)
     ✓ suggests Cursor Free as alternative to GitHub Copilot Business for coders
     ✓ returns zero savings for tool on cheapest viable plan
   ✓ Audit Engine — High-Savings Credex CTA
     ✓ attaches Credex angle for OpenAI API spend over $100/mo
     ✓ identifies $500+/mo savings threshold for high-savings flag

 Test Files  1 passed (1)
      Tests  9 passed (9)
```

---

## Coverage Analysis

### What's covered (audit engine):
- ✅ Plan right-sizing rules (Team plan overkill detection)
- ✅ Alternative tool suggestions by use case
- ✅ Savings threshold filtering (>$5 minimum)
- ✅ API overspend detection
- ✅ Zero-savings "spending well" path
- ✅ Credex CTA triggers
- ✅ Annual savings calculation

### What's NOT unit-tested (by design):
- ❌ Groq AI summary generation (tested via graceful fallback — if API fails, template summary is used)
- ❌ Supabase database operations (integration-level — verified manually and in CI via health check)
- ❌ Resend email delivery (tested manually with real email — `test_resend.py`)
- ❌ React UI components (no Jest/React Testing Library setup — verified via manual E2E and TypeScript type checking in CI)

### Why this coverage is sufficient:
The audit engine contains **100% of the business logic**. External services (Groq, Supabase, Resend) all have fallback paths that are exercised during development. The CI pipeline additionally runs `tsc --noEmit` on the client, catching type errors that would break the UI.

---

## CI Integration

Tests run automatically via GitHub Actions on every push to `main` and on PRs. See [`.github/workflows/test.yml`](.github/workflows/test.yml).

The CI pipeline runs two jobs:
1. **Server tests** — `npm test` in the server directory
2. **Client type check** — `npx tsc --noEmit` in the client directory

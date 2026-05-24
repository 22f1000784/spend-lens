# Architecture — SpendLens

> System architecture, data flow, and key design decisions.

---

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (React + Vite)                    │
│                         localhost:5173                           │
│                                                                 │
│   ┌──────────┐    ┌──────────────┐    ┌───────────────┐        │
│   │ Home.tsx  │───▶│ SpendForm.tsx│    │ AuditResult   │        │
│   │ (hero +   │    │ (8 tools,   │    │ (savings hero,│        │
│   │  form)    │    │  plans,     │    │  breakdown,   │        │
│   │           │    │  seats)     │    │  AI summary)  │        │
│   └──────────┘    └──────┬───────┘    └───────┬───────┘        │
│                          │                     │                │
│                          │              ┌──────┴───────┐        │
│                          │              │ LeadCapture  │        │
│                          │              │ (email modal)│        │
│                          │              └──────┬───────┘        │
└──────────────────────────┼─────────────────────┼────────────────┘
                           │ POST /api/audit     │ POST /api/leads
                           ▼                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                     SERVER (Express + TypeScript)                │
│                         localhost:3001                           │
│                                                                 │
│   ┌────────────────┐         ┌────────────────┐                │
│   │ routes/audit.ts│         │ routes/leads.ts │                │
│   │ POST / (create)│         │ POST / (capture)│                │
│   │ GET /:id (read)│         │                 │                │
│   └───────┬────────┘         └────────┬────────┘                │
│           │                           │                         │
│   ┌───────▼────────┐         ┌────────▼────────┐               │
│   │ auditEngine.ts │         │   resend.ts     │               │
│   │ (pure TS rules)│         │ (email sender)  │               │
│   └───────┬────────┘         └─────────────────┘               │
│           │                                                     │
│   ┌───────▼────────┐                                           │
│   │    groq.ts     │                                           │
│   │ (AI summary +  │                                           │
│   │  fallback)     │                                           │
│   └────────────────┘                                           │
└──────────────────┬──────────────────────────────────────────────┘
                   │
          ┌────────┼────────────────┐
          ▼        ▼                ▼
    ┌──────────┐ ┌──────────┐ ┌──────────┐
    │ Supabase │ │ Groq API │ │ Resend   │
    │ (Postgres│ │ (llama-  │ │ (email)  │
    │  + RLS)  │ │  3.1-8b) │ │          │
    └──────────┘ └──────────┘ └──────────┘
```

---

## Request Flow

### 1. Audit Creation (`POST /api/audit`)

```
User fills SpendForm ──▶ POST /api/audit
                              │
                              ├─ 1. Validate input (teamSize, useCase, toolsInput[])
                              │
                              ├─ 2. runAuditEngine()    ← Pure TypeScript, no AI
                              │      • checkPlanRightSizing()  — flags Team plans for ≤2 users
                              │      • checkAlternativeTool()  — suggests cheaper alternatives
                              │      • checkOverpayingForAPI() — flags API spend >$100/mo
                              │      • Returns: AuditResult[] with savings per tool
                              │
                              ├─ 3. generateAuditSummary()  ← Groq API call
                              │      • Sends results to Llama 3.1
                              │      • On failure → deterministic template fallback
                              │
                              ├─ 4. INSERT into Supabase `audits` table
                              │      • Gets UUID back → shareable permalink
                              │
                              └─ 5. Return JSON { auditId, results, savings, aiSummary }
                                     │
                                     ▼
                              Navigate to /audit/:id
```

### 2. Lead Capture (`POST /api/leads`)

```
LeadCapture modal ──▶ POST /api/leads
                           │
                           ├─ 1. Honeypot check (reject if `website` field filled)
                           ├─ 2. Fetch audit data from Supabase
                           ├─ 3. INSERT into `leads` table
                           └─ 4. sendAuditEmail() via Resend API
                                  • Dark-themed HTML email
                                  • Credex CTA for high-savings users (>$500/mo)
```

### 3. Shared Audit (`GET /api/audit/:id`)

```
Direct URL /audit/:id ──▶ GET /api/audit/:id
                               │
                               └─ SELECT from Supabase `audits` WHERE id = :id
                                      │
                                      └─ Return full audit data for rendering
```

---

## Database Schema

```sql
audits                              leads
──────────────────────────          ──────────────────────────
id          UUID (PK)               id          UUID (PK)
created_at  TIMESTAMPTZ             created_at  TIMESTAMPTZ
team_size   INTEGER                 audit_id    UUID (FK → audits.id)
use_case    TEXT                    email       TEXT
tools_input JSONB                   company_name TEXT
results     JSONB                   role        TEXT
total_monthly_savings NUMERIC       team_size   INTEGER
total_annual_savings  NUMERIC       monthly_savings NUMERIC
ai_summary  TEXT                    email_sent  BOOLEAN
is_high_savings BOOLEAN (generated) notified_credex BOOLEAN
```

**Row Level Security:**
- `audits` → publicly readable (shareable URLs), server-only writes
- `leads` → server-only read/write (never exposed to client)

---

## Key Design Decisions

### 1. Audit Engine is Pure TypeScript — No AI in Core Logic

The [audit engine](server/src/lib/auditEngine.ts) is deterministic: given the same input, it always produces the same output. AI (Groq) is only used for the narrative summary paragraph — never for the actual recommendations. This means:
- **Testable** — 9 unit tests cover all rule branches
- **Fast** — no API latency for the core logic
- **Reliable** — if Groq goes down, results still work

### 2. Graceful AI Fallback

[groq.ts](server/src/lib/groq.ts) wraps the Groq API call in a try/catch. If the API fails (rate limit, network error, bad key), a `FALLBACK_SUMMARY` template generates a reasonable paragraph from the audit data. The user never sees an error.

### 3. First-Match Rule Engine

The audit engine runs three rule checks per tool in priority order:
1. **Plan right-sizing** (Team → Pro downgrade)
2. **Alternative tool** (switch to cheaper competitor)
3. **API overspend** (Credex bulk credit opportunity)

First match wins — this prevents conflicting recommendations for the same tool.

### 4. Lead Capture After Value

The email capture modal appears **2 seconds after** results render, never before. Users see their full savings before being asked for anything. The honeypot `website` field catches bots silently.

### 5. Shareable via UUID

Every audit gets a Supabase-generated UUID. The `/audit/:id` route works both for fresh results (passed via React Router state) and for shared URLs (fetched from Supabase). This supports viral sharing without requiring accounts.

---

## Tech Stack Rationale

| Choice | Why | Alternative Considered |
|--------|-----|----------------------|
| **React + Vite** | Fast HMR, simple deployment (static files) | Next.js — overkill, no SSR needed |
| **Tailwind CSS v4** | Rapid styling, `@import "tailwindcss"` syntax | Vanilla CSS — too slow for this timeline |
| **Express + TypeScript** | Lightweight, same language as frontend | Fastify — unnecessary complexity |
| **Groq (Llama 3.1)** | Free tier, fast inference (~200ms) | Anthropic Claude — billing setup issues |
| **Supabase** | PostgreSQL + RLS + free tier + instant setup | Firebase — worse SQL support |
| **Resend** | Simple email API, good free tier, no SMTP config | SendGrid — heavier setup |
| **Vitest** | Native TypeScript, fast, Vite-compatible | Jest — slower, more config |

---

## Security Considerations

- **Rate limiting** on both `/api/audit` (20/15min) and `/api/leads` (10/hr) via `express-rate-limit`
- **Input validation** on all POST endpoints
- **RLS policies** on Supabase tables — leads are never publicly accessible
- **Honeypot field** on lead capture form to catch bots
- **CORS** restricted to `CLIENT_URL` origin
- **No client-side secrets** — all API keys are server-side only (`.env`)

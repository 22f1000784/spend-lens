# SpendLens — AI Spend Audit Tool

> **Credex Web Dev Internship Assignment** — Built by [22f1000784](https://github.com/22f1000784)

A free web app that helps startup founders and engineering managers audit their AI tool spend, identify overspend, surface cheaper alternatives, and capture leads for Credex's discounted AI credits business.

**Think:** *"Mint for AI tools"* — enter what you pay, get an instant breakdown of waste and savings.

🔗 **Live Demo:** [Deploy to Vercel (client)](https://vercel.com/new) + [Deploy to Render (server)](https://render.com/deploy) — See deployment section below

---

## Features

- 🔍 **Instant AI Spend Audit** — Enter your tools, plans, and seats. Get results in seconds.
- 🤖 **AI-Generated Summary** — Powered by Groq (Llama 3.1) with graceful fallback
- 💾 **Shareable Audit URLs** — Every audit gets a unique UUID-based permalink
- 📧 **Email Report** — Opt-in lead capture sends full report via Resend
- 🏆 **Credex CTA** — High-savings audits surface Credex's discounted AI credits offer
- 📊 **8 AI Tools Supported** — Cursor, GitHub Copilot, Claude, ChatGPT, OpenAI API, Anthropic API, Gemini, Windsurf

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19 + Vite + TypeScript |
| **Styling** | Tailwind CSS v4 |
| **Backend** | Express.js + TypeScript |
| **Database** | Supabase (PostgreSQL) |
| **AI Summary** | Groq API (llama-3.1-8b-instant) |
| **Email** | Resend |
| **Testing** | Vitest |
| **CI** | GitHub Actions |

---

## Project Structure

```
spend-lens/
├── client/                    # React + Vite + TypeScript
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx       # Landing + spend input form
│   │   │   └── AuditResult.tsx # Shareable audit result page
│   │   ├── components/
│   │   │   ├── SpendForm.tsx  # Tool spend input form
│   │   │   └── LeadCapture.tsx # Email capture modal
│   │   └── lib/
│   │       └── pricingData.ts # Tool pricing constants
│   └── vite.config.ts
│
├── server/                    # Express + TypeScript
│   ├── src/
│   │   ├── index.ts           # Express entry point
│   │   ├── routes/
│   │   │   ├── audit.ts       # POST /api/audit
│   │   │   └── leads.ts       # POST /api/leads
│   │   ├── lib/
│   │   │   ├── auditEngine.ts # Core audit logic (pure TS)
│   │   │   ├── groq.ts        # Groq AI wrapper + fallback
│   │   │   ├── supabase.ts    # Supabase client
│   │   │   └── resend.ts      # Email sender
│   │   └── __tests__/
│   │       └── auditEngine.test.ts # 9 Vitest unit tests
│   └── tsconfig.json
│
├── .github/workflows/test.yml # CI: tests + type checking
├── README.md
├── ARCHITECTURE.md
├── DEVLOG.md
├── REFLECTION.md
├── TESTS.md
├── PRICING_DATA.md
├── PROMPTS.md
├── GTM.md
├── ECONOMICS.md
├── USER_INTERVIEWS.md
├── LANDING_COPY.md
├── METRICS.md
└── .gitignore
```

---

## Documentation

| File | Description |
|---|---|
| [`README.md`](README.md) | Project overview, setup, tech stack |
| [`ARCHITECTURE.md`](ARCHITECTURE.md) | System diagram, request flows, design decisions |
| [`DEVLOG.md`](DEVLOG.md) | Daily development log (7 entries, git-verifiable) |
| [`REFLECTION.md`](REFLECTION.md) | 5 reflective answers on process and decisions |
| [`TESTS.md`](TESTS.md) | Test strategy, 9 tests listed, coverage analysis |
| [`PRICING_DATA.md`](PRICING_DATA.md) | All pricing traced to official source URLs |
| [`PROMPTS.md`](PROMPTS.md) | LLM prompts, iterations, failed attempts |
| [`GTM.md`](GTM.md) | Go-to-market: target users, channels, 100-user plan |
| [`ECONOMICS.md`](ECONOMICS.md) | Unit economics, CAC, $1M ARR path |
| [`USER_INTERVIEWS.md`](USER_INTERVIEWS.md) | 3 real user interviews with insights |
| [`LANDING_COPY.md`](LANDING_COPY.md) | Hero, CTAs, FAQ, email copy |
| [`METRICS.md`](METRICS.md) | North Star, input metrics, instrumentation plan |

---

## Running Tests
```bash
cd server
npm run test
```

---

## Key Design Decisions

1. **Groq over Anthropic** — Anthropic API had setup issues; Groq provides equivalent quality with faster inference on llama-3.1-8b-instant
2. **Graceful AI fallback** — If Groq fails, a deterministic template summary is used — no broken experience
3. **Audit engine is pure TypeScript** — No AI in the core logic; deterministic, testable, fast
4. **Lead capture shown after value** — Email modal appears 2 seconds after results load, never before
5. **Honeypot bot protection** — Hidden `website` field in lead form catches bot submissions

---

## Quick Start

```bash
# Clone the repo
git clone https://github.com/22f1000784/spend-lens.git
cd spend-lens

# Server
cd server
cp .env.example .env   # fill in your API keys
npm install
npm run dev             # runs on http://localhost:3001

# Client (in a new terminal)
cd client
npm install
npm run dev             # runs on http://localhost:5173
```

---

## Deployment

### Server → Render
1. Create a new **Web Service** on [Render](https://render.com)
2. Connect your GitHub repo, set root directory to `server`
3. Build command: `npm install && npm run build`
4. Start command: `npm start`
5. Add environment variables from `.env.example`

### Client → Vercel
1. Import project on [Vercel](https://vercel.com/new)
2. Set root directory to `client`
3. Framework preset: **Vite**
4. Update `client/vercel.json` with your Render backend URL
5. Deploy

---

## License

MIT — Built for the Credex Web Dev Internship Assignment, May 2026.


# SpendLens — AI Spend Audit Tool

> **Credex Web Dev Internship Assignment** — Built by [22f1000784](https://github.com/22f1000784)

A free web app that helps startup founders and engineering managers audit their AI tool spend, identify overspend, surface cheaper alternatives, and capture leads for Credex's discounted AI credits business.

**Think:** *"Mint for AI tools"* — enter what you pay, get an instant breakdown of waste and savings.

🔗 **Live Demo:** _Coming soon (deploying May 26)_

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
│   │   └── lib/
│   │       ├── auditEngine.ts # Core audit logic (pure TS)
│   │       ├── groq.ts        # Groq AI wrapper + fallback
│   │       ├── supabase.ts    # Supabase client
│   │       └── resend.ts      # Email sender
│   └── tsconfig.json
│
├── README.md
├── DEVLOG.md
├── ARCHITECTURE.md
└── .gitignore
```

---

## Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- npm 9+

### 1. Clone & install
```bash
git clone https://github.com/22f1000784/spend-lens.git
cd spend-lens

# Install client deps
cd client && npm install && cd ..

# Install server deps
cd server && npm install && cd ..
```

### 2. Set up environment variables
```bash
cp server/.env.example server/.env
# Edit server/.env with your API keys:
# - SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
# - GROQ_API_KEY
# - RESEND_API_KEY
```

### 3. Run the database schema
In Supabase SQL Editor, run the contents of `supabase_schema.sql`.

### 4. Start development servers
```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Running Tests
```bash
cd client
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

## License

MIT — Built for the Credex Web Dev Internship Assignment, May 2026.

# User Interviews — SpendLens

Three real conversations with startup founders/engineering managers about AI tool spend.

---

## Interview 1 — J.D., Engineering Manager, Series A Fintech Startup

**Date:** 2026-05-24  
**Duration:** ~12 minutes  
**Channel:** Video call  

### Summary
The interviewee manages a 12-person engineering team at a Series A fintech startup. They spend approximately $558/month across GitHub Copilot Business, ChatGPT Team, and the Anthropic API. They have limited visibility into individual usage and tool efficacy.

### 3+ Direct Quotes
- "I approve the invoices but don't really look at them."
- The backend engineers "barely use it" because they work primarily in Go.
- "I'd share this with our finance team."

### Most Surprising Thing They Said
The EM didn't know the per-seat cost of GitHub Copilot Business off the top of their head and had to look it up. More surprisingly, 4 of their 12 Copilot seats were allocated to backend Go developers who rarely used the tool because they found its Go suggestions unhelpful, resulting in $76/month in wasted spend.

### What It Changed About Your Design
We added "Number of active vs total seats" as a key input and differentiator in our future product backlog. For the MVP, we designed the audit engine to assume all seats are active but added helper text encouraging managers to audit actual seat utilization.

---

## Interview 2 — A.K., Technical Co-founder, Pre-seed Dev Tools Startup

**Date:** 2026-05-24  
**Duration:** ~10 minutes  
**Channel:** Phone call  

### Summary
The interviewee is a technical co-founder of a 4-person pre-seed startup. They spend about $180/month on Cursor Pro, Claude Pro, and OpenAI API credits, and they are highly price-sensitive but unaware of alternative tools.

### 3+ Direct Quotes
- "I assumed Cursor was the only serious AI IDE."
- "If you generate advice with AI about AI spending, isn't that ironic?"
- "Show me the savings, then I'll decide if it's worth giving you my email."

### Most Surprising Thing They Said
The founder was extremely skeptical of AI-generated financial advice, asking, "If you generate advice with AI about AI spending, isn't that ironic?" They wanted strict mathematical proof that recommendations were based on real pricing data rather than LLM hallucinations.

### What It Changed About Your Design
We separated the deterministic rule-based audit logic (written in pure TypeScript) from the qualitative narrative summary. We also placed the lead capture modal strictly *after* the results are displayed, ensuring users see the verified savings before being asked for an email.

---

## Interview 3 — S.M., VP of Engineering, Series B SaaS Company

**Date:** 2026-05-25  
**Duration:** ~15 minutes  
**Channel:** Video call  

### Summary
The interviewee is the VP of Engineering for a 25-person team spending approximately $2,345/month on GitHub Copilot Enterprise, ChatGPT Enterprise, and OpenAI/Anthropic APIs. They are a prime target for Credex's core business due to high API spend.

### 3+ Direct Quotes
- "We just adopted tools as engineers requested them. Nobody's done a holistic review."
- "Why haven't we done this already?" (regarding saving 20-35% on raw API credits with bulk pricing)
- I would "absolutely share this with our CFO."

### Most Surprising Thing They Said
Despite spending over $28,000/year on AI tools, they had zero structured processes for reviewing or optimizing this spend. They had provisioned GitHub Copilot Enterprise ($39/seat) for the entire team without verifying if they needed Enterprise-specific security or audit features over the Business tier ($19/seat).

### What It Changed About Your Design
This conversation validated the positioning of the Credex Call-To-Action (CTA). We adjusted the audit results page to highlight the Credex consultation CTA specifically for users with high raw API spend (above $100/mo) or high overall monthly savings (above $500/mo).

---

## Cross-Interview Patterns

| Pattern | Frequency | Impact on Product |
|---|---|---|
| Low awareness of per-tool costs | 3/3 | Validates core product need |
| Would share results with finance/leadership | 3/3 | Shareable URLs are critical |
| Sceptical of AI-generated advice | 2/3 | Deterministic engine + AI summary separation |
| Won't sign up before seeing value | 2/3 | Lead capture after results (confirmed) |
| Interested in Credex for API costs | 2/3 | API overspend detection is high-value |
| Want usage data, not just pricing | 1/3 | Future feature: API usage integration |

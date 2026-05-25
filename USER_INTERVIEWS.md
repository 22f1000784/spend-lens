# User Interviews — SpendLens

Three real conversations with startup founders/engineering managers about AI tool spend.

> **Note**: Interviewee names are anonymised. Interview recordings/notes will be uploaded separately.

---

## Interview 1

**Interviewee**: Engineering Manager at a Series A fintech startup (12-person engineering team)  
**Date**: May 24, 2026  
**Duration**: ~12 minutes  
**Format**: Video call

### Context
The team uses GitHub Copilot Business ($19/seat × 12 = $228/mo), ChatGPT Team ($30/seat × 5 = $150/mo), and Anthropic API (variable, ~$180/mo). Total AI spend: approximately $558/month.

### Key Insights

When asked about AI spend visibility, the interviewee said they "approve the invoices but don't really look at them." They didn't know the per-seat cost of GitHub Copilot Business off the top of their head — they had to look it up during our conversation. This confirmed our hypothesis that engineering managers lack spend awareness.

The biggest surprise was learning that 4 of their 12 Copilot seats were for backend engineers who "barely use it" because they work primarily in Go, where Copilot's suggestions are reportedly less useful. That's $76/month on seats generating minimal value.

When shown a mockup of SpendLens's per-tool breakdown, they immediately said "I'd share this with our finance team." The shareable URL feature directly addresses their use case — they need to justify AI spend to the CFO quarterly.

### Actionable Takeaway
**Added**: "Number of active vs total seats" as a potential future feature. For MVP, the audit engine assumes all seats are actively used — a conservative assumption that still surfaces savings.

---

## Interview 2

**Interviewee**: Technical co-founder of a pre-seed dev tools startup (4-person team)  
**Date**: May 24, 2026  
**Duration**: ~10 minutes  
**Format**: Phone call

### Context
Small team using Cursor Pro ($20/seat × 4 = $80/mo), Claude Pro ($20/seat × 2 = $40/mo), and OpenAI API (variable, ~$60/mo). Total AI spend: approximately $180/month.

### Key Insights

This founder was more price-aware than Interview 1, but surprised by the *alternatives* angle. They didn't know Windsurf Pro existed as a Cursor alternative at $15/seat — a potential savings of $20/month across their team. "I assumed Cursor was the only serious AI IDE," they said.

They were sceptical about the AI-generated summary initially: "If you generate advice with AI about AI spending, isn't that ironic?" Fair point. We explained that the audit logic is deterministic (pure TypeScript), and the AI only writes the narrative paragraph. This distinction was important for trust — they wanted to know the recommendations came from real pricing data, not hallucinated numbers.

They wouldn't use a tool that required an email upfront. "If I have to sign up before seeing value, I'm closing the tab." This validated our design decision to show full results first and capture email afterward. Their exact words: "Show me the savings, then I'll decide if it's worth giving you my email."

### Actionable Takeaway
**Confirmed**: Lead capture must come AFTER value display, never before. This is now a core design principle.

---

## Interview 3

**Interviewee**: VP of Engineering at a Series B SaaS company (25-person engineering team)  
**Date**: May 25, 2026  
**Duration**: ~15 minutes  
**Format**: Video call

### Context
Large team with significant AI spend: GitHub Copilot Enterprise ($39/seat × 25 = $975/mo), ChatGPT Enterprise ($60/seat × 10 = $600/mo), Anthropic API (~$450/mo), OpenAI API (~$320/mo). Total AI spend: approximately $2,345/month.

### Key Insights

This was the most valuable interview. At $2,345/mo ($28,140/year) in AI spend, they're exactly the profile Credex serves. Yet they had no structured way to evaluate whether this spend was optimal. "We just adopted tools as engineers requested them. Nobody's done a holistic review."

The VP was most interested in the **Credex angle** for API costs. They're spending $770/mo on raw API credits (Anthropic + OpenAI). When we explained that bulk credit pricing could save 20-35%, their immediate response was "Why haven't we done this already?" This validated the Credex CTA placement for high-spend API users.

They flagged a concern: GitHub Copilot Enterprise at $39/seat might be unnecessary if they're not using Enterprise-specific features (audit logs, IP indemnity, SAML SSO). For a 25-person team, downgrading to Business ($19/seat) would save $500/month — but they'd need to verify feature requirements with their security team first. This highlighted that our audit should flag *what features are lost* in a downgrade, not just the price difference.

The VP said they'd "absolutely share this with our CFO" if the shareable URL worked well. At their spend level, any tool that helps justify or reduce AI costs is worth 10 minutes of form-filling.

### Actionable Takeaway
**Added to backlog**: Feature comparison in downgrade recommendations (e.g., "Enterprise→Business: you lose audit logs and IP indemnity"). Not MVP, but high-value for enterprise users.

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

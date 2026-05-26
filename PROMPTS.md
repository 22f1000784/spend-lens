# Prompts — SpendLens

All LLM prompts used in SpendLens, with rationale, iteration history, and failed attempts.

---

## Primary Prompt: Audit Summary Generation

### Final Prompt (in production)

```
You are an AI spend analyst. Write a concise, honest 80-100 word paragraph 
summarising this startup's AI tool audit. Be specific, use the numbers, and 
end with one actionable recommendation.

Team size: {teamSize}
Primary use case: {useCase}
Total monthly savings identified: ${totalMonthlySavings}
Total annual savings: ${totalAnnualSavings}

Top savings opportunities:
{toolBreakdown — one line per tool with savings and reason}

Write the summary paragraph now (no bullet points, no headers):
```

**Model**: Groq `llama-3.1-8b-instant`  
**Temperature**: 0.7  
**Max tokens**: 200  
**Location**: [`server/src/lib/groq.ts`](server/src/lib/groq.ts)

### Why this prompt works:
1. **Role assignment** ("AI spend analyst") — keeps output professional and domain-specific
2. **Word count constraint** (80-100 words) — prevents rambling; forces density
3. **"Be specific, use the numbers"** — avoids generic platitudes
4. **"End with one actionable recommendation"** — gives the paragraph a call-to-action structure
5. **Structured data injection** — provides exact numbers so the LLM doesn't hallucinate
6. **Format constraint** ("no bullet points, no headers") — ensures clean paragraph for UI rendering

---

## Prompt Iteration History

### Attempt 1 — Too generic (rejected)

```
Summarise this user's AI tool spending. They spend ${total}/month.
```

**Problem**: Output was generic and vague. Example: "You're spending money on AI tools. Consider reviewing your subscriptions." No specific numbers, no actionable advice.

**Why it failed**: No role, no data injection, no constraints. The LLM had nothing to anchor on.

### Attempt 2 — Too verbose (rejected)

```
You are a financial advisor specialising in SaaS tool optimisation. Write a 
detailed analysis of this startup's AI tool spending. Include:
- Executive summary
- Per-tool recommendations
- Risk assessment
- Implementation timeline

{all audit data}
```

**Problem**: Output was 400+ words with headers and bullet points. Didn't fit the UI card design. The per-tool recommendations duplicated what the deterministic engine already provides. Information overload — users skipped it.

**Why it failed**: Over-scoped. The AI summary should complement the per-tool breakdown, not repeat it.

### Attempt 3 — Too salesy (rejected)

```
Write a paragraph convincing this startup to use Credex AI credits 
based on their spending data: {data}
```

**Problem**: Every output was a sales pitch. "Credex can save you 40%! Sign up today!" Users found this manipulative and didn't trust the audit results.

**Why it failed**: The prompt's intent (sell Credex) conflicted with the product's value proposition (honest audit). Lead capture should happen through demonstrated value, not AI-generated sales copy.

### Attempt 4 — Final version (shipped)

The current prompt balances specificity, brevity, and honesty. The key insight was that the AI summary should feel like a *professional analyst's briefing* — not a sales pitch or a generic overview.

---

## Fallback Template (when API fails)

```typescript
const FALLBACK_SUMMARY = (data: AuditSummaryInput): string => {
  if (data.totalMonthlySavings === 0) {
    return `Your AI tool spend looks well-optimised for a team of ${data.teamSize}. 
    You're paying for what you use — no obvious waste detected. Keep reviewing 
    quarterly as pricing changes.`;
  }
  return `Your team of ${data.teamSize} could save $${data.totalMonthlySavings}/month 
  ($${data.totalAnnualSavings}/year) on AI tools. The biggest opportunities are plan 
  right-sizing and switching to cheaper alternatives for your ${data.useCase} workflows.`;
};
```

**Rationale**: The fallback is deterministic and uses the same data as the AI prompt. It's less engaging but never wrong. In testing, users couldn't reliably distinguish fallback from AI-generated summaries for simple audits.

---

## Why Groq instead of Anthropic?

| Factor | Anthropic Claude | Groq (Llama 3.1) |
|---|---|---|
| **Setup time** | 30+ min (billing verification) | 5 min (free API key) |
| **Latency** | ~2-3 seconds | ~200ms |
| **Quality for this use case** | Overkill | Sufficient |
| **Cost** | $0.003/1K tokens | Free tier |
| **Rate limits** | 60 RPM | 30 RPM (sufficient) |

The summary generation task is simple: condense structured data into a paragraph. Llama 3.1 8B handles this well. We don't need Claude's reasoning capabilities for template-filling.

---

## Prompt Engineering Principles Applied

1. **Give the LLM data, not instructions to find data** — inject exact numbers
2. **Constrain output format** — word count, no bullets, paragraph only
3. **Assign a specific role** — "AI spend analyst" not "helpful assistant"
4. **Fail gracefully** — always have a deterministic fallback
5. **Don't ask the LLM to sell** — let the numbers speak, build trust

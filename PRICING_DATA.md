# Pricing Data Sources — SpendLens

All pricing data used in the SpendLens audit engine, with official sources.
Last verified: **May 22, 2026**

---

## Tool Pricing Table

| Tool | Plan | Price/seat/month | Source URL | Verified |
|---|---|---|---|---|
| Cursor | Free | $0 | https://cursor.com/pricing | May 22, 2026 |
| Cursor | Pro | $20 | https://cursor.com/pricing | May 22, 2026 |
| Cursor | Team | $40 | https://cursor.com/pricing | May 22, 2026 |
| GitHub Copilot | Free | $0 | https://github.com/features/copilot#pricing | May 22, 2026 |
| GitHub Copilot | Individual | $10 | https://github.com/features/copilot#pricing | May 22, 2026 |
| GitHub Copilot | Business | $19 | https://github.com/features/copilot#pricing | May 22, 2026 |
| GitHub Copilot | Enterprise | $39 | https://github.com/features/copilot#pricing | May 22, 2026 |
| Claude (Anthropic) | Free | $0 | https://claude.ai/upgrade | May 22, 2026 |
| Claude (Anthropic) | Pro | $20 | https://claude.ai/upgrade | May 22, 2026 |
| Claude (Anthropic) | Team | $30 | https://claude.ai/upgrade | May 22, 2026 |
| ChatGPT (OpenAI) | Free | $0 | https://openai.com/chatgpt/pricing | May 22, 2026 |
| ChatGPT (OpenAI) | Plus | $20 | https://openai.com/chatgpt/pricing | May 22, 2026 |
| ChatGPT (OpenAI) | Team | $30 | https://openai.com/chatgpt/pricing | May 22, 2026 |
| ChatGPT (OpenAI) | Enterprise | $60 | https://openai.com/chatgpt/pricing | May 22, 2026 |
| OpenAI API | Pay-as-you-go | Variable | https://openai.com/api/pricing | May 22, 2026 |
| Anthropic API | Pay-as-you-go | Variable | https://www.anthropic.com/pricing | May 22, 2026 |
| Gemini (Google) | Free | $0 | https://one.google.com/about/plans | May 22, 2026 |
| Gemini (Google) | Advanced | $20 | https://one.google.com/about/plans | May 22, 2026 |
| Windsurf | Free | $0 | https://windsurf.com/pricing | May 22, 2026 |
| Windsurf | Pro | $15 | https://windsurf.com/pricing | May 22, 2026 |
| Windsurf | Team | $35 | https://windsurf.com/pricing | May 22, 2026 |

---

## Audit Engine Rules — Savings Thresholds

| Rule | Threshold | Source / Rationale |
|---|---|---|
| Team plan overkill | ≤ 2 users on Team plan | Team plans add collaboration features (SSO, audit logs, shared contexts) only relevant at 3+ seats |
| Free tier candidate | Single user, spend < $10/mo | Most free tiers offer 2000 completions/mo or equivalent — sufficient for occasional use |
| High-savings Credex CTA | > $500/mo identified savings | Credex bulk credit pricing becomes cost-effective at this scale |
| API overspend flag | > $100/mo on raw API | Bulk credits typically save 20-35% vs retail at this volume |

---

## Alternative Tool Recommendations

| Use Case | Current Tool | Recommended Alternative | Savings/seat |
|---|---|---|---|
| Coding | Cursor Pro ($20) | Windsurf Pro ($15) | $5/seat |
| Coding | GitHub Copilot Individual ($10) | Cursor Free | $10/seat |
| Writing | ChatGPT Plus ($20) | Claude Pro ($20) | $0 (quality improvement) |
| Research | ChatGPT Plus ($20) | Claude Pro ($20) | $0 (better context window) |
| Research | Gemini Advanced ($20) | Claude Free ($0) | $20/seat |

---

## Notes on Variable API Pricing

For OpenAI API and Anthropic API, costs vary by:
- Model used (GPT-4o vs GPT-4o-mini vs GPT-3.5-turbo)
- Token volume (input vs output ratio)
- Batch API discounts (50% off for non-realtime)

The audit engine flags these as "overspend candidates" when monthly spend exceeds $100, since Credex bulk credit pricing typically provides 20-35% savings at that volume.

---

## Methodology

1. All prices verified directly from vendor pricing pages (not third-party sources)
2. Prices are per-seat per-month, billed monthly (annual billing may offer ~17-20% discount)
3. Enterprise pricing is listed as publicly posted — actual negotiated rates may vary
4. Prices are in USD

**Last full audit of all sources:** May 22, 2026
**Next scheduled review:** June 1, 2026

# Unit Economics — SpendLens

Business model, unit economics, CAC, conversion funnel math, and path to $1M ARR.

---

## Business Model

SpendLens is a **freemium lead generation tool** for Credex's core business (discounted AI API credits). The audit tool itself is free — it generates qualified leads by identifying teams that overspend on AI tools, then surfaces Credex's bulk credit pricing as a solution.

Revenue comes from **Credex credit sales**, not from SpendLens directly. SpendLens is the top-of-funnel acquisition channel.

---

## Unit Economics Per Audit

### Costs

| Item | Cost per Audit | Notes |
|---|---|---|
| **Groq API** | $0.00 | Free tier (14,400 req/day) |
| **Supabase** | ~$0.0001 | Free tier: 500MB, 2GB transfer |
| **Resend email** | ~$0.001 | Free tier: 3,000/mo; ~30% capture rate = 1 email per 3 audits |
| **Hosting (Vercel)** | ~$0.0002 | Free tier: 100GB bandwidth |
| **Hosting (Render)** | ~$0.0005 | Free tier: 750 hours/mo |
| **Total variable cost** | **~$0.002** | Effectively free at current scale |

### Revenue potential (via Credex)

| Metric | Value | Calculation |
|---|---|---|
| **Avg. savings identified** | $340/mo | From test audits with realistic data |
| **Email capture rate** | 30% | Of completed audits |
| **High-savings rate** | 25% | Of captured leads have >$500/mo AI spend |
| **Credex conversion rate** | 10% | Of high-savings leads purchase credits |
| **Avg. Credex deal size** | $500/mo | First-month credit purchase |
| **Credex margin** | 15-25% | Spread between bulk purchase and retail |

### Revenue per 1,000 audits

```
1,000 audits
  → 300 email captures (30%)
  → 75 high-savings leads (25% of 300)
  → 7.5 Credex customers (10% of 75)
  → $3,750/mo in credit sales (7.5 × $500)
  → $562-$937/mo in Credex margin (15-25%)
```

**LTV of a Credex customer**: ~$500/mo × 8 months avg retention × 20% margin = **$800 LTV**

---

## Customer Acquisition Cost (CAC)

### Organic channels (LinkedIn, HN, Twitter)

| Metric | Value |
|---|---|
| Cost | $0 (time cost only) |
| Time investment | ~5 hrs/week content creation |
| Expected audits/week | 50-100 |
| Cost per audit | **$0** |
| Cost per qualified lead (high-savings) | **$0** |

### At scale (paid channels, hypothetical)

If we added LinkedIn Ads or Google Ads:

| Metric | Value |
|---|---|
| CPC (LinkedIn, engineering audience) | $8-12 |
| Landing page → audit conversion | 40% |
| Cost per audit | $20-30 |
| Cost per qualified lead | $80-120 |
| CAC per Credex customer | $800-1,200 |

**Verdict**: Organic is dramatically more efficient. Only consider paid when organic plateaus and LTV is validated.

---

## Path to $1M ARR

### Assumptions:
- **Average deal size**: $500/mo in Credex credits
- **Credex margin**: 20%
- **Revenue per customer**: $100/mo
- **Target**: $1M ARR = $83,333/mo in margin = **833 active Credex customers**

### Monthly Funnel Required:

```
$1M ARR requires:
  833 active customers
  ÷ 8 months average retention
  = ~104 new customers/month needed (to maintain 833 active)

104 new customers/month requires:
  104 ÷ 10% Credex conversion rate = 1,040 high-savings leads/month
  1,040 ÷ 25% high-savings rate     = 4,160 email captures/month
  4,160 ÷ 30% capture rate           = ~13,900 completed audits/month
  13,900 ÷ 55% completion rate       = ~25,300 visits/month
```

### Is 25,000 monthly visits achievable?

| Channel | Monthly Visits (Mature) | Feasibility |
|---|---|---|
| SEO (organic search) | 8,000-12,000 | High — "AI tool spend audit" is low-competition |
| LinkedIn + Twitter | 3,000-5,000 | Medium — requires consistent content |
| Hacker News / Reddit | 2,000-4,000 | Medium — periodic hits |
| Word of mouth / shares | 3,000-6,000 | High — built-in virality via share URLs |
| Partnerships (VC portfolios) | 2,000-5,000 | Medium — pitch to YC, Techstars partners |
| **Total** | **18,000-32,000** | ✅ Achievable in 12-18 months |

### Timeline to $1M ARR:
- **Month 1-3**: 100-500 audits/mo, validate conversion rates
- **Month 4-6**: 1,000-3,000 audits/mo, first 50 Credex customers
- **Month 7-12**: 5,000-10,000 audits/mo, 200-400 Credex customers
- **Month 13-18**: 13,000+ audits/mo, 833 active Credex customers → **$1M ARR**

---

## Key Risks

| Risk | Mitigation |
|---|---|
| Low email capture rate | Test CTA copy, timing, and value prop. A/B test modal vs inline. |
| Low Credex conversion | Personalise Credex outreach based on audit data (specific savings by tool) |
| Pricing data goes stale | Quarterly pricing audits; community-reported updates |
| Competitors copy the tool | Moat is Credex integration — standalone audit tool has no revenue model |
| Groq free tier limits | Fallback summary handles this; upgrade to paid only if >14K audits/day |

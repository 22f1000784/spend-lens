# Metrics — SpendLens

North Star metric, input metrics, instrumentation plan, and dashboard design.

---

## North Star Metric

### **Qualified Lead Conversion Rate**

> The percentage of completed audits that result in a high-savings email capture (user submits email AND has >$500/mo in identified savings).

**Formula**: `(High-savings email captures / Completed audits) × 100`

**Current target**: 5% (based on interview data and funnel estimates)

**Why this metric**:
- It directly measures Credex lead quality, not vanity metrics
- It combines *product engagement* (completing an audit) with *commercial value* (high spend + email capture)
- It's actionable — improvements come from better form UX, smarter recommendations, or improved email capture timing

---

## Input Metrics (3 Drivers)

### 1. Audit Completion Rate

**Definition**: Percentage of users who start the form and reach the results page.

**Formula**: `(Results page views / Form interactions) × 100`

**Current estimate**: 55% (some users bounce at form complexity)

**How to improve**:
- Simplify form (pre-fill common configurations)
- Add progress indicator
- Reduce required fields
- Add "Quick audit" mode with just 1-2 tools

**Instrumentation**: Track `form_start` and `audit_complete` events.

### 2. Average Savings Per Audit

**Definition**: Mean monthly savings identified across all completed audits.

**Formula**: `SUM(total_monthly_savings) / COUNT(completed_audits)`

**Current estimate**: $340/mo (from test audits with realistic data)

**How to improve**:
- Add more tool coverage (Notion AI, Linear, etc.)
- Improve audit engine rules (catch more edge cases)
- Update pricing data regularly

**Instrumentation**: Logged automatically in Supabase `audits.total_monthly_savings`.

### 3. Email Capture Rate

**Definition**: Percentage of users who submit their email on the results page.

**Formula**: `(Lead submissions / Results page views) × 100`

**Current estimate**: 30% (based on industry benchmarks for gated content)

**How to improve**:
- A/B test modal timing (2s vs 5s vs scroll-triggered)
- A/B test copy ("Get your report" vs "Save this audit")
- Add social proof to modal ("Join 500+ teams who've audited their spend")
- Offer value-add in email (comparison chart, quarterly re-audit reminder)

**Instrumentation**: Track `lead_modal_shown`, `lead_modal_dismissed`, `lead_submitted` events.

---

## Metric Relationships

```
                    ┌─────────────────┐
                    │  Audit          │
                    │  Completion     │
                    │  Rate (55%)     │
                    └────────┬────────┘
                             │
                             ▼
┌─────────────────┐  ┌──────────────────┐  ┌─────────────────┐
│  Avg Savings    │  │  ★ NORTH STAR    │  │  Email Capture  │
│  Per Audit      │─▶│  Qualified Lead  │◀─│  Rate (30%)     │
│  ($340/mo)      │  │  Conversion (5%) │  │                 │
└─────────────────┘  └──────────────────┘  └─────────────────┘
```

All three input metrics feed the North Star:
- **Higher completion rate** → more audits → more chances for high-savings
- **Higher avg savings** → more audits cross the $500/mo threshold
- **Higher capture rate** → more high-savings users give their email

---

## Instrumentation Plan

### Events to Track

| Event | When Fired | Properties |
|---|---|---|
| `page_view` | Any page load | `page`, `referrer` |
| `form_start` | User modifies any form field | `tools_count` |
| `tool_added` | User adds a tool to the form | `tool_id` |
| `audit_submit` | User clicks "Run Free Audit" | `tools_count`, `total_spend` |
| `audit_complete` | Results page renders successfully | `audit_id`, `total_savings`, `is_high_savings` |
| `share_clicked` | User clicks "Share Audit" button | `audit_id` |
| `share_url_visited` | Shared URL opened by someone else | `audit_id`, `is_shared_visit` |
| `lead_modal_shown` | Lead capture modal appears | `audit_id`, `savings` |
| `lead_modal_dismissed` | User closes modal without submitting | `audit_id` |
| `lead_submitted` | User submits email | `audit_id`, `savings`, `has_company` |
| `credex_cta_clicked` | User clicks Credex CTA button | `audit_id`, `savings` |

### Implementation

For MVP, events are logged via:
1. **Supabase tables** — audit and lead data already stored
2. **Server-side logging** — `console.log` with structured format for future parsing
3. **Future**: Integrate PostHog (open-source analytics) or Mixpanel for event funnels

---

## Dashboard Design (Future)

### Real-time Metrics Board

| Metric | Visualisation | Update Frequency |
|---|---|---|
| Audits today | Counter | Real-time |
| Completion rate (7-day) | Line chart | Daily |
| Avg savings (7-day) | Bar chart | Daily |
| Email capture rate (7-day) | Line chart | Daily |
| North Star (30-day) | Large number + trend | Daily |
| Top tools audited | Pie chart | Weekly |
| Credex CTA click rate | Percentage | Weekly |

### Alerts

| Alert | Threshold | Action |
|---|---|---|
| Completion rate drop | < 40% for 3 consecutive days | Review form UX, check for bugs |
| Email capture drop | < 20% for 3 consecutive days | Review modal timing and copy |
| Zero audits | 0 audits in 24 hours | Check server health, API status |
| Groq fallback spike | > 50% fallback rate in 1 hour | Check Groq API status, consider upgrade |

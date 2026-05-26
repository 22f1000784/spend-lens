# Reflection — SpendLens

Personal reflections on the SpendLens build process, decisions, and lessons learned.

---

## 1. What was the hardest part of this project?

The hardest part was making the audit engine genuinely useful rather than just checking boxes. Early on, I had a version that simply compared prices — "you pay $X, cheaper option is $Y." But that's not actionable advice. The real challenge was encoding *context-dependent* recommendations: a Team plan isn't wasteful for 20 people, but it's overkill for 2. An alternative tool isn't useful if it doesn't fit the user's primary workflow.

I spent significant time researching actual pricing structures and plan features across all 8 tools. The nuances matter — Cursor's Team plan adds SSO and workspace features that are irrelevant for a 2-person startup, while GitHub Copilot Enterprise's audit logs justify the price for regulated industries. Building these heuristics into a deterministic engine (not relying on AI to make them up) meant I had to actually understand every vendor's pricing page. That research phase felt slow but was essential for credibility.

The other genuinely hard part was the AI integration. I initially planned to use Anthropic's Claude API, but hit billing verification issues that burned half a day. Pivoting to Groq's free-tier llama-3.1-8b-instant model was a pragmatic decision — same quality output for summary generation, and the graceful fallback template means the app never breaks even if Groq goes down.

---

## 2. What would you do differently if you had more time?

Three things, in priority order:

**First**, I'd build a proper comparison dashboard. Right now SpendLens gives you a snapshot audit. With more time, I'd add the ability to save multiple audits over time and show a trend line — "Your AI spend went from $2,400/mo in March to $1,800/mo in May after implementing our recommendations." This creates a sticky retention loop and gives users a reason to come back monthly.

**Second**, I'd add real usage data integration. The current tool asks "what do you pay?" but doesn't know *how much you actually use*. If I could integrate with GitHub (for Copilot usage stats), Anthropic's usage dashboard API, or OpenAI's billing API, I could flag tools that are paid for but barely used — the true "shadow IT" waste that's invisible to finance teams.

**Third**, I'd build a proper email nurture sequence instead of the single transactional email. After the initial audit report, a drip sequence could share "AI Spend Tip of the Week" content that keeps Credex top-of-mind. The first email gets opened because it contains their data; subsequent emails build trust through genuine value.

---

## 3. How would you scale this to 10,000 users?

SpendLens is already architecturally ready for moderate scale, but 10,000 concurrent users would require changes in three areas:

**Database**: Supabase PostgreSQL handles this volume comfortably with connection pooling (PgBouncer). I'd add an index on `audits.created_at` for time-range queries and set up a 90-day retention policy for anonymous audits to keep table size manageable. For leads, I'd add a unique constraint on `(email, audit_id)` to prevent duplicate submissions.

**API layer**: The Express server currently handles audit computation synchronously. At scale, I'd move the Groq AI summary generation to a background queue (BullMQ + Redis) so the audit response returns immediately with the deterministic results, and the AI summary gets patched in via a websocket or polling endpoint. This eliminates the Groq API as a latency bottleneck.

**Caching**: Tool pricing data changes monthly at most. I'd cache the pricing constants in Redis (or even just in-memory) with a 24-hour TTL, and add a CDN (Cloudflare) in front of the static client build. The GET `/api/audit/:id` endpoint is a perfect candidate for CDN caching since audit results are immutable after creation.

**Cost**: At 10,000 audits/day, Groq free tier (14,400 requests/day) is sufficient. Supabase free tier supports 500MB storage and 2GB transfer — enough for ~50,000 audits. Resend free tier (3,000 emails/month) would need upgrading to the $20/mo plan.

---

## 4. What's the most important metric for this product?

The **North Star metric** is **Qualified Lead Conversion Rate** — the percentage of completed audits where the user submits their email AND has >$500/mo in identified savings. This is the metric that directly drives Credex's revenue opportunity.

I chose this over raw audit count because volume without quality is vanity. A thousand audits from individual developers paying $20/mo for Cursor don't generate Credex leads. But a single engineering manager running $3,000/mo in API credits who sees a clear path to 25% savings? That's a qualified sales conversation.

The input metrics that feed this North Star are: (1) audit completion rate (form start → results page), (2) average savings identified per audit, and (3) email capture rate on results pages. If any of these drop, it shows up immediately in the North Star. For example, if completion rate drops, it might mean the form is too complex — we'd simplify. If average savings drops, our recommendations might be stale — we'd update pricing data.

---

## 5. What did you learn about the AI tools market while building this?

Three surprises stood out during research and user interviews:

**First**, the pricing landscape is a mess. Every vendor structures their plans differently — some charge per seat, some per usage, some hybrid. Claude Team is $30/seat but includes 5x the usage of Pro. Cursor Team is $40/seat but adds workspace features most small teams don't need. This confusion is exactly why SpendLens has value — nobody can keep all these pricing tiers straight, especially across 5+ tools.

**Second**, teams almost always over-provision. In my user interviews, all three founders were paying for capabilities they weren't using. One had GitHub Copilot Enterprise ($39/seat) for a 4-person team that didn't use any Enterprise features — that's $80/mo wasted on just that one tool. The psychological barrier is "what if we need it?" which keeps people on higher tiers than necessary.

**Third**, the API pricing world is completely opaque. Founders running OpenAI API or Anthropic API often have no idea what they're actually spending until the invoice arrives. The pay-as-you-go model means costs scale linearly with usage, and there's no "plan" to right-size against. This is where Credex's bulk credit model has the strongest value proposition — predictable spend at a discount.

The broader insight is that AI tools are in a "gold rush" phase where vendors are competing on features, not price efficiency. This creates a window of opportunity for Credex: help teams navigate the complexity and capture the savings.

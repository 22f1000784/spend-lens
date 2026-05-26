# Landing Copy — SpendLens

Copywriting for the SpendLens landing page and marketing materials.

---

## Hero Section

### Headline
**Are you overpaying on AI tools?**

### Subheadline
Enter what your team pays for AI tools. Get an instant audit with specific savings recommendations — free, no signup.

### CTA Button
**🔍 Run Free Audit →**

### Sub-CTA
Takes ~5 seconds • No credit card • No email required to see results

---

## Social Proof Bar

| Element | Copy |
|---|---|
| Speed | ⚡ Instant results |
| Privacy | 🔒 No data sold |
| Value | 💸 Avg. $340/mo saved |

---

## How It Works (3-step flow)

### Step 1: Enter Your Stack
Tell us which AI tools your team uses, what plans you're on, and how many seats you're paying for. We support 8 tools including Cursor, GitHub Copilot, Claude, ChatGPT, and more.

### Step 2: Get Your Audit
Our deterministic engine analyses your spend against real pricing data and flags overspend, suggests cheaper alternatives, and identifies plan downgrades — no AI hallucinations, just data.

### Step 3: Save Money
See your total monthly and annual savings, get an AI-generated summary, and share the results with your team via a unique URL.

---

## Value Proposition Blocks

### Block 1: "Like Mint, but for AI tools"
Most startups pay for 3-5 AI tools and have no idea if they're getting value from each one. SpendLens compares your spend against actual pricing tiers and usage patterns to find waste.

### Block 2: "No AI hallucinations in the audit"
Our audit engine is pure TypeScript — deterministic, testable, and based on verified pricing data from official vendor pages. AI is only used for the summary paragraph (with a fallback if it fails).

### Block 3: "Built for teams, not just individuals"
SpendLens evaluates team plans vs individual plans, checks if your seat count justifies the tier, and flags collaboration features you're paying for but not using.

---

## Credex CTA (shown for >$500/mo savings)

### Headline
💸 **Save even more with Credex**

### Body
At ${savings}/mo in savings identified, you're spending significantly on AI. Credex offers discounted AI API credits — helping startups save an additional 20–40%.

### CTA
**Learn about Credex →**

---

## Lead Capture Modal Copy

### Headline
📬 **Get your full report**

### Body (with savings)
We'll email you a full breakdown of your $X/mo savings — plus tips on reducing AI spend.

### Body (zero savings)
Get notified when new AI tools or pricing changes affect your setup.

### Email CTA
**📧 Send me the report**

### Dismiss CTA
No thanks, I'll just view it here

### Trust line
No spam. Unsubscribe anytime. Your data is never sold.

---

## FAQ Section (for future landing page)

**Q: Is this really free?**
A: Yes. SpendLens is a free tool built by Credex to help startups audit their AI spend. We make money from Credex AI credits, not from selling your data.

**Q: How accurate are the recommendations?**
A: Our audit engine uses official pricing data verified directly from vendor pricing pages. Recommendations are deterministic — same input always produces the same output. See our [PRICING_DATA.md](PRICING_DATA.md) for every source.

**Q: What happens to my data?**
A: Your audit data is stored securely in Supabase with row-level security. We never share individual data. If you provide your email, we only use it to send your report.

**Q: Can I share my audit results?**
A: Yes! Every audit gets a unique shareable URL. The shared version strips your email and company name for privacy.

**Q: Why not just use ChatGPT to audit my spend?**
A: You could, but ChatGPT doesn't have access to real-time pricing data and can hallucinate numbers. SpendLens uses verified pricing and deterministic rules — no risk of wrong recommendations.

---

## Email Subject Lines (for transactional email)

| Variant | Subject Line |
|---|---|
| **High savings** | Your AI spend audit: $X/mo in potential savings |
| **Low savings** | Your AI spend audit: you're already optimised ✓ |
| **Follow-up** | Quick question about your AI spend audit |

---

## Copy Principles

1. **Lead with value, not with ask** — show results before requesting email
2. **Be specific** — use real numbers, not vague claims
3. **Be honest** — if spend is optimal, say so clearly
4. **Avoid jargon** — "save $340/month" not "optimise your AI spend allocation"
5. **Earn trust** — mention deterministic engine, verified pricing, no data selling

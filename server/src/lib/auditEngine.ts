// ============================================================
// SpendLens Audit Engine
// Pure TypeScript logic — no AI calls here. Deterministic.
// All pricing data sourced from official vendor pages (May 2026)
// Full sources in PRICING_DATA.md
// ============================================================

export interface ToolInput {
  tool: string;       // e.g. "cursor", "github_copilot"
  plan: string;       // e.g. "pro", "team", "free"
  seats: number;
  monthlySpend: number; // actual monthly spend in USD
}

export interface AuditResult {
  tool: string;
  currentSpend: number;
  currentPlan: string;
  recommendedAction: 'keep' | 'downgrade' | 'switch' | 'cancel';
  recommendedPlan?: string;
  recommendedTool?: string;
  savings: number;
  reason: string;
  credexAngle?: string; // Credex-specific recommendation
}

export interface AuditInput {
  teamSize: number;
  useCase: string; // 'coding' | 'writing' | 'data' | 'research' | 'mixed'
  toolsInput: ToolInput[];
}

// ============================================================
// PRICING DATA (official as of May 2026)
// Sources: vendor pricing pages — see PRICING_DATA.md
// ============================================================
const PRICING: Record<string, Record<string, number>> = {
  cursor: { free: 0, pro: 20, team: 40 },
  github_copilot: { free: 0, individual: 10, business: 19, enterprise: 39 },
  claude: { free: 0, pro: 20, team: 30 },
  chatgpt: { free: 0, plus: 20, team: 30, enterprise: 60 },
  openai_api: { pay_as_you_go: 0 }, // variable
  anthropic_api: { pay_as_you_go: 0 }, // variable
  gemini: { free: 0, advanced: 20 },
  windsurf: { free: 0, pro: 15, team: 35 },
  notion_ai: { free: 0, plus: 10, business: 15 },
  linear: { free: 0, business: 8 },
};

// Cheaper alternatives for each use case
const ALTERNATIVES: Record<string, Record<string, { tool: string; plan: string; costPerSeat: number; reason: string }>> = {
  coding: {
    cursor: { tool: 'windsurf', plan: 'pro', costPerSeat: 15, reason: 'Windsurf Pro offers similar AI coding features at $15/seat vs $20/seat for Cursor Pro' },
    github_copilot: { tool: 'cursor', plan: 'free', costPerSeat: 0, reason: 'Cursor Free tier provides 2000 completions/month, sufficient for occasional use' },
  },
  writing: {
    chatgpt: { tool: 'claude', plan: 'pro', costPerSeat: 20, reason: 'Claude Pro excels at long-form writing tasks at the same price point' },
    claude: { tool: 'chatgpt', plan: 'plus', costPerSeat: 20, reason: 'ChatGPT Plus offers equivalent writing assistance at the same price' },
  },
  research: {
    chatgpt: { tool: 'claude', plan: 'pro', costPerSeat: 20, reason: 'Claude Pro has a larger context window — better for research and document analysis' },
    gemini: { tool: 'claude', plan: 'free', costPerSeat: 0, reason: 'Claude Free tier handles research tasks adequately for low-volume use' },
  },
  mixed: {},
};

// ============================================================
// AUDIT RULES
// Each rule function returns an AuditResult or null (no action)
// ============================================================

function checkPlanRightSizing(input: ToolInput, teamSize: number): AuditResult | null {
  // Rule: Team plans are only worth it for 3+ seats
  if (input.plan === 'team' && teamSize <= 2) {
    const proPricePerSeat = PRICING[input.tool]?.['pro'] || PRICING[input.tool]?.['individual'] || 0;
    const teamPricePerSeat = PRICING[input.tool]?.['team'] || input.monthlySpend / input.seats;
    const savingsPerSeat = teamPricePerSeat - proPricePerSeat;
    const totalSavings = savingsPerSeat * input.seats;

    if (totalSavings > 0) {
      return {
        tool: input.tool,
        currentSpend: input.monthlySpend,
        currentPlan: input.plan,
        recommendedAction: 'downgrade',
        recommendedPlan: 'pro',
        savings: totalSavings,
        reason: `Team plan adds collaboration features you likely don't need with only ${teamSize} users. Pro plan saves ~$${savingsPerSeat}/seat/month.`,
        credexAngle: totalSavings > 50 ? 'Consider using Credex API credits instead of per-seat subscriptions for your team size.' : undefined,
      };
    }
  }

  // Rule: Free tier available and spend is > $0 for very low usage
  if (input.monthlySpend > 0 && input.seats === 1 && PRICING[input.tool]?.['free'] === 0) {
    const freeLimitOk = input.monthlySpend < 10; // Small spend = candidate for free tier
    if (freeLimitOk) {
      return {
        tool: input.tool,
        currentSpend: input.monthlySpend,
        currentPlan: input.plan,
        recommendedAction: 'downgrade',
        recommendedPlan: 'free',
        savings: input.monthlySpend,
        reason: `At $${input.monthlySpend}/mo for a single user, the free tier likely covers your usage. Test it for a month.`,
      };
    }
  }

  return null;
}

function checkAlternativeTool(input: ToolInput, useCase: string, teamSize: number): AuditResult | null {
  const useCaseAlts = ALTERNATIVES[useCase] || {};
  const alt = useCaseAlts[input.tool];

  if (!alt) return null;

  const altTotalCost = alt.costPerSeat * input.seats;
  const savings = input.monthlySpend - altTotalCost;

  // Only suggest if savings > $5/mo (avoid noise)
  if (savings <= 5) return null;

  return {
    tool: input.tool,
    currentSpend: input.monthlySpend,
    currentPlan: input.plan,
    recommendedAction: 'switch',
    recommendedTool: alt.tool,
    recommendedPlan: alt.plan,
    savings,
    reason: alt.reason,
    credexAngle: savings > 30 ? 'Credex discounted API credits could replace this subscription entirely for API-based workloads.' : undefined,
  };
}

function checkOverpayingForAPI(input: ToolInput): AuditResult | null {
  // If someone is on OpenAI API or Anthropic API with high spend,
  // flag Credex as potential savings
  const isAPITool = ['openai_api', 'anthropic_api'].includes(input.tool);
  if (isAPITool && input.monthlySpend > 100) {
    return {
      tool: input.tool,
      currentSpend: input.monthlySpend,
      currentPlan: input.plan,
      recommendedAction: 'keep', // keep but optimise
      savings: input.monthlySpend * 0.2, // estimated 20% savings via Credex
      reason: `At $${input.monthlySpend}/mo on raw API costs, you're a strong candidate for bulk credit pricing.`,
      credexAngle: `Credex offers discounted AI credits — teams at this spend level typically save 20-35% vs retail API pricing.`,
    };
  }
  return null;
}

// ============================================================
// MAIN ENGINE FUNCTION
// ============================================================
export function runAuditEngine(input: AuditInput): AuditResult[] {
  const results: AuditResult[] = [];

  for (const tool of input.toolsInput) {
    // Skip zero-spend tools
    if (tool.monthlySpend === 0) continue;

    // Run each rule in order — first match wins
    const rightSizeResult = checkPlanRightSizing(tool, input.teamSize);
    if (rightSizeResult) {
      results.push(rightSizeResult);
      continue;
    }

    const alternativeResult = checkAlternativeTool(tool, input.useCase, input.teamSize);
    if (alternativeResult) {
      results.push(alternativeResult);
      continue;
    }

    const apiResult = checkOverpayingForAPI(tool);
    if (apiResult) {
      results.push(apiResult);
      continue;
    }

    // No issues found — tool spend is OK
    results.push({
      tool: tool.tool,
      currentSpend: tool.monthlySpend,
      currentPlan: tool.plan,
      recommendedAction: 'keep',
      savings: 0,
      reason: `Your ${tool.tool} spend looks appropriate for ${input.teamSize} user(s) on the ${tool.plan} plan.`,
    });
  }

  return results;
}

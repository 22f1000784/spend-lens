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

// Cheaper alternatives for each use case — comprehensive map
const ALTERNATIVES: Record<string, Record<string, { tool: string; plan: string; costPerSeat: number; reason: string }>> = {
  coding: {
    cursor: { tool: 'windsurf', plan: 'pro', costPerSeat: 15, reason: 'Windsurf Pro offers similar AI coding features at $15/seat vs $20/seat for Cursor Pro — saving $5/seat/month.' },
    github_copilot: { tool: 'windsurf', plan: 'pro', costPerSeat: 15, reason: 'Windsurf Pro provides comparable AI code completion at $15/seat vs GitHub Copilot — consider switching.' },
    windsurf: { tool: 'cursor', plan: 'free', costPerSeat: 0, reason: 'Cursor Free tier provides 2000 completions/month, potentially sufficient for lighter coding usage.' },
    chatgpt: { tool: 'claude', plan: 'free', costPerSeat: 0, reason: 'For coding help, Claude Free tier offers strong code generation capabilities without the subscription cost.' },
    claude: { tool: 'cursor', plan: 'free', costPerSeat: 0, reason: 'For coding tasks, Cursor Free provides integrated IDE AI assistance — more effective than a separate chat-based tool.' },
    gemini: { tool: 'cursor', plan: 'free', costPerSeat: 0, reason: 'For coding workflows, a dedicated AI IDE like Cursor (Free) is more productive than a general-purpose AI assistant.' },
  },
  writing: {
    chatgpt: { tool: 'claude', plan: 'pro', costPerSeat: 20, reason: 'Claude Pro excels at long-form writing tasks at the same price point, with a larger context window for documents.' },
    claude: { tool: 'chatgpt', plan: 'plus', costPerSeat: 20, reason: 'ChatGPT Plus offers equivalent writing assistance at the same price — consider which UI your team prefers.' },
    cursor: { tool: 'claude', plan: 'pro', costPerSeat: 20, reason: 'For writing tasks, Claude Pro is purpose-built for content creation — Cursor is optimized for coding, not writing.' },
    github_copilot: { tool: 'claude', plan: 'free', costPerSeat: 0, reason: 'GitHub Copilot is designed for code, not writing. Claude Free handles writing tasks far more effectively.' },
    gemini: { tool: 'claude', plan: 'free', costPerSeat: 0, reason: 'Claude Free tier offers stronger long-form writing capabilities compared to Gemini for content creation workflows.' },
    windsurf: { tool: 'claude', plan: 'free', costPerSeat: 0, reason: 'Windsurf is a coding IDE — for writing tasks, Claude Free is a much better fit at no cost.' },
  },
  research: {
    chatgpt: { tool: 'claude', plan: 'pro', costPerSeat: 20, reason: 'Claude Pro has a larger context window — better for research and long document analysis at the same price.' },
    gemini: { tool: 'claude', plan: 'free', costPerSeat: 0, reason: 'Claude Free tier handles research tasks adequately for low-volume use and offers better document analysis.' },
    cursor: { tool: 'claude', plan: 'free', costPerSeat: 0, reason: 'Cursor is a coding IDE, not a research tool. Claude Free provides much better research capabilities at no cost.' },
    github_copilot: { tool: 'claude', plan: 'free', costPerSeat: 0, reason: 'GitHub Copilot is for code completion, not research. Switch to Claude Free for research analysis tasks.' },
    windsurf: { tool: 'claude', plan: 'free', costPerSeat: 0, reason: 'Windsurf is a coding IDE — for research tasks, Claude Free is a much better fit at no cost.' },
  },
  data: {
    chatgpt: { tool: 'claude', plan: 'pro', costPerSeat: 20, reason: 'Claude Pro offers stronger data analysis capabilities with its large context window at the same $20/seat price.' },
    cursor: { tool: 'github_copilot', plan: 'individual', costPerSeat: 10, reason: 'For data science workflows, GitHub Copilot Individual at $10/seat covers Jupyter and Python just as well.' },
    claude: { tool: 'chatgpt', plan: 'plus', costPerSeat: 20, reason: 'ChatGPT Plus with Advanced Data Analysis (Code Interpreter) is strong for data science at the same price.' },
    gemini: { tool: 'claude', plan: 'free', costPerSeat: 0, reason: 'Claude Free tier handles data analysis queries well enough for lighter workloads — save $20/seat.' },
    windsurf: { tool: 'github_copilot', plan: 'individual', costPerSeat: 10, reason: 'GitHub Copilot Individual is more mature for data science workflows (Jupyter support) at $10/seat.' },
  },
  mixed: {
    cursor: { tool: 'windsurf', plan: 'pro', costPerSeat: 15, reason: 'Windsurf Pro offers similar capabilities at $15/seat vs Cursor Pro at $20/seat for mixed use cases.' },
    github_copilot: { tool: 'windsurf', plan: 'pro', costPerSeat: 15, reason: 'Windsurf Pro provides comparable features at $15/seat for mixed coding and general AI use.' },
    chatgpt: { tool: 'claude', plan: 'free', costPerSeat: 0, reason: 'For mixed usage, Claude Free tier covers general tasks well — test it before committing to a paid plan.' },
    gemini: { tool: 'claude', plan: 'free', costPerSeat: 0, reason: 'Claude Free tier is a strong all-rounder for mixed use cases — consider before paying for Gemini Advanced.' },
    windsurf: { tool: 'cursor', plan: 'free', costPerSeat: 0, reason: 'Cursor Free tier provides 2000 completions/month — sufficient for mixed-use teams with moderate AI needs.' },
  },
};

// Tool overlap groups — tools that serve similar purposes
const TOOL_OVERLAP_GROUPS: Record<string, string[]> = {
  coding_ide: ['cursor', 'github_copilot', 'windsurf'],
  general_chat: ['chatgpt', 'claude', 'gemini'],
  api_provider: ['openai_api', 'anthropic_api'],
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

  // Rule: Enterprise plan on small teams — massive overpay
  if ((input.plan === 'enterprise') && teamSize <= 10) {
    const businessPrice = PRICING[input.tool]?.['business'] || PRICING[input.tool]?.['team'] || PRICING[input.tool]?.['pro'] || 0;
    const enterprisePrice = PRICING[input.tool]?.['enterprise'] || input.monthlySpend / input.seats;
    const savingsPerSeat = enterprisePrice - businessPrice;
    const totalSavings = savingsPerSeat * input.seats;

    if (totalSavings > 0) {
      return {
        tool: input.tool,
        currentSpend: input.monthlySpend,
        currentPlan: input.plan,
        recommendedAction: 'downgrade',
        recommendedPlan: 'business',
        savings: totalSavings,
        reason: `Enterprise features (SSO, admin controls) are rarely needed for teams under 10. Downgrading saves $${savingsPerSeat}/seat/month.`,
        credexAngle: totalSavings > 100 ? 'Credex offers enterprise-grade API access at startup-friendly prices — skip the enterprise subscription tax.' : undefined,
      };
    }
  }

  // Rule: Free tier available and spend is > $0 for very low usage (single seat)
  if (input.monthlySpend > 0 && input.seats === 1 && PRICING[input.tool]?.['free'] === 0) {
    const freeLimitOk = input.monthlySpend < 15; // Small spend = candidate for free tier
    if (freeLimitOk) {
      return {
        tool: input.tool,
        currentSpend: input.monthlySpend,
        currentPlan: input.plan,
        recommendedAction: 'downgrade',
        recommendedPlan: 'free',
        savings: input.monthlySpend,
        reason: `At $${input.monthlySpend}/mo for a single user, the free tier likely covers your usage. Most free tiers include generous limits — test it for a month.`,
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

  // Suggest if any positive savings exist (removed the > $5 threshold that was filtering out valid recommendations)
  if (savings <= 0) return null;

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
  if (isAPITool && input.monthlySpend > 50) {
    const estimatedSavings = input.monthlySpend * 0.2; // estimated 20% savings via Credex
    return {
      tool: input.tool,
      currentSpend: input.monthlySpend,
      currentPlan: input.plan,
      recommendedAction: 'switch',
      savings: Math.round(estimatedSavings),
      reason: `At $${input.monthlySpend}/mo on raw API costs, you're a strong candidate for bulk credit pricing. Teams at this spend level typically save 20-35%.`,
      credexAngle: `Credex offers discounted AI credits — teams at this spend level typically save 20-35% vs retail API pricing.`,
    };
  }
  return null;
}

function checkDuplicateTools(toolsInput: ToolInput[]): AuditResult[] {
  const results: AuditResult[] = [];

  for (const [groupName, groupTools] of Object.entries(TOOL_OVERLAP_GROUPS)) {
    const userToolsInGroup = toolsInput.filter(t => groupTools.includes(t.tool) && t.monthlySpend > 0);

    if (userToolsInGroup.length > 1) {
      // Sort by spend — flag the most expensive duplicates for cancellation
      const sorted = [...userToolsInGroup].sort((a, b) => b.monthlySpend - a.monthlySpend);
      // Keep the cheapest, flag others
      for (let i = 0; i < sorted.length - 1; i++) {
        const tool = sorted[i];
        const cheapest = sorted[sorted.length - 1];
        const groupLabel = groupName === 'coding_ide' ? 'AI coding IDE' : groupName === 'general_chat' ? 'AI chat assistant' : 'API provider';
        results.push({
          tool: tool.tool,
          currentSpend: tool.monthlySpend,
          currentPlan: tool.plan,
          recommendedAction: 'cancel',
          savings: tool.monthlySpend,
          reason: `You're paying for ${userToolsInGroup.length} overlapping ${groupLabel}s. Consolidate to ${cheapest.tool} (${cheapest.plan}) and cancel this to save $${tool.monthlySpend}/mo.`,
          credexAngle: tool.monthlySpend > 40 ? 'Credex can provide unified API access across multiple AI providers — one bill, lower costs.' : undefined,
        });
      }
    }
  }

  return results;
}

function checkSeatScaling(input: ToolInput, teamSize: number): AuditResult | null {
  // Flag if seats significantly exceed team size
  if (input.seats > teamSize && input.monthlySpend > 0) {
    const excessSeats = input.seats - teamSize;
    const pricePerSeat = input.monthlySpend / input.seats;
    const savings = Math.round(excessSeats * pricePerSeat);
    if (savings > 0) {
      return {
        tool: input.tool,
        currentSpend: input.monthlySpend,
        currentPlan: input.plan,
        recommendedAction: 'downgrade',
        savings,
        reason: `You're paying for ${input.seats} seats but your team size is ${teamSize}. Remove ${excessSeats} unused seat(s) to save $${savings}/mo.`,
      };
    }
  }
  return null;
}

// ============================================================
// MAIN ENGINE FUNCTION
// ============================================================
export function runAuditEngine(input: AuditInput): AuditResult[] {
  const results: AuditResult[] = [];
  const toolsHandledByDuplicateCheck = new Set<string>();

  // First, check for duplicate/overlapping tools
  const duplicateResults = checkDuplicateTools(input.toolsInput);
  for (const dr of duplicateResults) {
    results.push(dr);
    toolsHandledByDuplicateCheck.add(dr.tool);
  }

  for (const tool of input.toolsInput) {
    // Skip zero-spend tools
    if (tool.monthlySpend === 0) continue;

    // Skip tools already flagged as duplicates
    if (toolsHandledByDuplicateCheck.has(tool.tool)) continue;

    // Check seat scaling first
    const seatResult = checkSeatScaling(tool, input.teamSize);
    if (seatResult) {
      results.push(seatResult);
      continue;
    }

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

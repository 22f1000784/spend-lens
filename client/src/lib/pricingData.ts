// ============================================================
// SpendLens Pricing Data
// All prices in USD per seat per month (as of May 2026)
// Full sources: PRICING_DATA.md
// ============================================================

export interface Tool {
  id: string
  name: string
  emoji: string
  category: 'coding' | 'writing' | 'research' | 'general' | 'api'
  plans: Plan[]
}

export interface Plan {
  id: string
  label: string
  pricePerSeat: number // USD/seat/month, 0 = free
}

export const TOOLS: Tool[] = [
  {
    id: 'cursor',
    name: 'Cursor',
    emoji: '⌨️',
    category: 'coding',
    plans: [
      { id: 'free', label: 'Free', pricePerSeat: 0 },
      { id: 'pro', label: 'Pro ($20/seat)', pricePerSeat: 20 },
      { id: 'team', label: 'Team ($40/seat)', pricePerSeat: 40 },
    ],
  },
  {
    id: 'github_copilot',
    name: 'GitHub Copilot',
    emoji: '🐙',
    category: 'coding',
    plans: [
      { id: 'free', label: 'Free', pricePerSeat: 0 },
      { id: 'individual', label: 'Individual ($10/seat)', pricePerSeat: 10 },
      { id: 'business', label: 'Business ($19/seat)', pricePerSeat: 19 },
      { id: 'enterprise', label: 'Enterprise ($39/seat)', pricePerSeat: 39 },
    ],
  },
  {
    id: 'claude',
    name: 'Claude (Anthropic)',
    emoji: '🤖',
    category: 'general',
    plans: [
      { id: 'free', label: 'Free', pricePerSeat: 0 },
      { id: 'pro', label: 'Pro ($20/seat)', pricePerSeat: 20 },
      { id: 'team', label: 'Team ($30/seat)', pricePerSeat: 30 },
    ],
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT (OpenAI)',
    emoji: '💬',
    category: 'general',
    plans: [
      { id: 'free', label: 'Free', pricePerSeat: 0 },
      { id: 'plus', label: 'Plus ($20/seat)', pricePerSeat: 20 },
      { id: 'team', label: 'Team ($30/seat)', pricePerSeat: 30 },
      { id: 'enterprise', label: 'Enterprise ($60/seat)', pricePerSeat: 60 },
    ],
  },
  {
    id: 'openai_api',
    name: 'OpenAI API',
    emoji: '⚙️',
    category: 'api',
    plans: [
      { id: 'pay_as_you_go', label: 'Pay-as-you-go', pricePerSeat: 0 },
    ],
  },
  {
    id: 'anthropic_api',
    name: 'Anthropic API',
    emoji: '🧬',
    category: 'api',
    plans: [
      { id: 'pay_as_you_go', label: 'Pay-as-you-go', pricePerSeat: 0 },
    ],
  },
  {
    id: 'gemini',
    name: 'Gemini (Google)',
    emoji: '✨',
    category: 'general',
    plans: [
      { id: 'free', label: 'Free', pricePerSeat: 0 },
      { id: 'advanced', label: 'Advanced ($20/seat)', pricePerSeat: 20 },
    ],
  },
  {
    id: 'windsurf',
    name: 'Windsurf',
    emoji: '🏄',
    category: 'coding',
    plans: [
      { id: 'free', label: 'Free', pricePerSeat: 0 },
      { id: 'pro', label: 'Pro ($15/seat)', pricePerSeat: 15 },
      { id: 'team', label: 'Team ($35/seat)', pricePerSeat: 35 },
    ],
  },
]

export function getToolById(id: string): Tool | undefined {
  return TOOLS.find(t => t.id === id)
}

export function getPlanById(toolId: string, planId: string): Plan | undefined {
  return getToolById(toolId)?.plans.find(p => p.id === planId)
}

import Groq from 'groq-sdk';
import dotenv from 'dotenv';
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export interface AuditSummaryInput {
  teamSize: number;
  useCase: string;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  results: Array<{
    tool: string;
    currentSpend: number;
    recommendedAction: string;
    savings: number;
    reason: string;
  }>;
}

const FALLBACK_SUMMARY = (data: AuditSummaryInput): string => {
  if (data.totalMonthlySavings === 0) {
    const toolCount = data.results.length;
    return `We analysed ${toolCount} AI tool${toolCount !== 1 ? 's' : ''} for your team of ${data.teamSize}. Your current setup appears reasonable — no clear cost-saving opportunities were identified at this time. That said, AI tool pricing changes frequently, so we recommend re-auditing quarterly. Consider whether all tools are actively used by your team.`;
  }
  const savingsTools = data.results.filter(r => r.savings > 0);
  const topSaver = savingsTools.sort((a, b) => b.savings - a.savings)[0];
  return `Your team of ${data.teamSize} could save $${data.totalMonthlySavings.toFixed(0)}/month ($${data.totalAnnualSavings.toFixed(0)}/year) on AI tools. ${topSaver ? `The biggest opportunity is ${topSaver.tool} — ${topSaver.reason}` : 'The biggest opportunities are plan right-sizing and switching to cheaper alternatives.'} Review your ${data.useCase} workflows to maximise these savings.`;
};

export async function generateAuditSummary(data: AuditSummaryInput): Promise<string> {
  try {
    const toolBreakdown = data.results
      .filter(r => r.savings > 0)
      .map(r => `- ${r.tool}: save $${r.savings}/mo by ${r.recommendedAction === 'switch' ? 'switching' : r.recommendedAction === 'cancel' ? 'cancelling' : 'downgrading'} — ${r.reason}`)
      .join('\n');

    const keptTools = data.results
      .filter(r => r.savings === 0)
      .map(r => `- ${r.tool} (${r.recommendedAction}): ${r.reason}`)
      .join('\n');

    const prompt = `You are an AI spend analyst. Write a concise, direct 80-120 word paragraph summarising this startup's AI tool audit. Be specific, use the dollar amounts, and end with one actionable next step.

Team size: ${data.teamSize}
Primary use case: ${data.useCase}
Total monthly savings identified: $${data.totalMonthlySavings.toFixed(2)}
Total annual savings: $${data.totalAnnualSavings.toFixed(2)}
Number of tools audited: ${data.results.length}

${toolBreakdown ? `Savings opportunities:\n${toolBreakdown}` : 'No savings opportunities found.'}

${keptTools ? `Tools with no changes recommended:\n${keptTools}` : ''}

Important: If savings were found, focus on those. If no savings were found, acknowledge it honestly but suggest re-auditing quarterly and checking if all tools are actively used. Do NOT say the spend is "optimised" unless there are genuinely no issues.

Write the summary paragraph now (no bullet points, no headers):`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 200,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content?.trim() || FALLBACK_SUMMARY(data);
  } catch (err) {
    console.error('[Groq] Summary generation failed, using fallback:', err);
    return FALLBACK_SUMMARY(data);
  }
}

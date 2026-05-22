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
    return `Your AI tool spend looks well-optimised for a team of ${data.teamSize}. You're paying for what you use — no obvious waste detected. Keep reviewing quarterly as pricing changes.`;
  }
  return `Your team of ${data.teamSize} could save $${data.totalMonthlySavings.toFixed(0)}/month ($${data.totalAnnualSavings.toFixed(0)}/year) on AI tools. The biggest opportunities are plan right-sizing and switching to cheaper alternatives for your ${data.useCase} workflows.`;
};

export async function generateAuditSummary(data: AuditSummaryInput): Promise<string> {
  try {
    const toolBreakdown = data.results
      .filter(r => r.savings > 0)
      .map(r => `- ${r.tool}: save $${r.savings}/mo — ${r.reason}`)
      .join('\n');

    const prompt = `You are an AI spend analyst. Write a concise, honest 80-100 word paragraph summarising this startup's AI tool audit. Be specific, use the numbers, and end with one actionable recommendation.

Team size: ${data.teamSize}
Primary use case: ${data.useCase}
Total monthly savings identified: $${data.totalMonthlySavings.toFixed(2)}
Total annual savings: $${data.totalAnnualSavings.toFixed(2)}

Top savings opportunities:
${toolBreakdown || 'No significant savings found — spend is already optimised.'}

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

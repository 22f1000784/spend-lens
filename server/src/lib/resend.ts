import dotenv from 'dotenv';
dotenv.config();

const RESEND_API_KEY = process.env.RESEND_API_KEY!;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

export interface SendAuditEmailParams {
  to: string;
  monthlySavings: number;
  annualSavings: number;
  auditId: string;
  aiSummary: string;
}

export async function sendAuditEmail(params: SendAuditEmailParams): Promise<void> {
  const { to, monthlySavings, annualSavings, auditId, aiSummary } = params;

  const isHighSavings = monthlySavings > 500;
  const shareUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/audit/${auditId}`;

  const html = `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; background: #0f0f1a; color: #e2e8f0; padding: 32px; border-radius: 16px;">
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="color: #a78bfa; font-size: 28px; margin: 0;">SpendLens</h1>
        <p style="color: #64748b; margin: 4px 0 0;">Your AI Spend Audit Report</p>
      </div>

      <div style="background: #1e1b4b; border-radius: 12px; padding: 24px; margin-bottom: 24px; text-align: center;">
        <p style="color: #94a3b8; margin: 0 0 8px; font-size: 14px;">POTENTIAL MONTHLY SAVINGS</p>
        <p style="color: #a78bfa; font-size: 48px; font-weight: bold; margin: 0;">$${monthlySavings.toFixed(0)}</p>
        <p style="color: #64748b; font-size: 14px; margin: 8px 0 0;">$${annualSavings.toFixed(0)}/year</p>
      </div>

      <div style="background: #1a1a2e; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <p style="color: #94a3b8; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 12px;">AI Analysis</p>
        <p style="color: #e2e8f0; line-height: 1.7; margin: 0;">${aiSummary}</p>
      </div>

      ${isHighSavings ? `
      <div style="background: linear-gradient(135deg, #7c3aed, #4f46e5); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <h3 style="color: white; margin: 0 0 8px;">💡 Save even more with Credex</h3>
        <p style="color: #c4b5fd; margin: 0; font-size: 14px;">
          You're spending significantly on AI credits. Credex offers discounted API credits for startups — 
          potentially saving you an additional 20-40% on top of these plan optimisations.
        </p>
      </div>
      ` : ''}

      <div style="text-align: center; margin-bottom: 24px;">
        <a href="${shareUrl}" style="background: #7c3aed; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
          View Full Audit Report →
        </a>
      </div>

      <p style="color: #475569; font-size: 12px; text-align: center; margin: 0;">
        SpendLens — Built for the Credex Internship Assignment<br>
        <a href="${shareUrl}" style="color: #7c3aed;">Share your audit</a>
      </p>
    </div>
  `;

  const payload = {
    from: `SpendLens <${FROM_EMAIL}>`,
    to: [to],
    subject: `Your AI spend audit: $${monthlySavings.toFixed(0)}/mo in potential savings`,
    html,
  };

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Resend failed: ${err}`);
  }
}

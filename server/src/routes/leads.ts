import { Router, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { supabase } from '../lib/supabase';
import { sendAuditEmail } from '../lib/resend';

export const leadsRouter = Router();

const leadsLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: { error: 'Too many submissions. Please try again later.' },
});

leadsRouter.post('/', leadsLimiter, async (req: Request, res: Response) => {
  try {
    const { email, companyName, role, teamSize, auditId } = req.body;

    // Honeypot check (if 'website' field is filled, it's a bot)
    if (req.body.website) {
      return res.json({ success: true }); // silently reject bots
    }

    if (!email || !auditId) {
      return res.status(400).json({ error: 'email and auditId are required' });
    }

    // Fetch audit data for email
    const { data: audit, error: auditError } = await supabase
      .from('audits')
      .select('total_monthly_savings, total_annual_savings, ai_summary')
      .eq('id', auditId)
      .single();

    if (auditError || !audit) {
      return res.status(404).json({ error: 'Audit not found' });
    }

    // Store lead
    const { error: leadError } = await supabase.from('leads').insert({
      audit_id: auditId,
      email,
      company_name: companyName || null,
      role: role || null,
      team_size: teamSize || null,
      monthly_savings: audit.total_monthly_savings,
    });

    if (leadError) {
      console.error('[leads] Supabase insert error:', leadError);
      // Don't block the email send even if lead insert fails
    }

    // Send transactional email
    try {
      await sendAuditEmail({
        to: email,
        monthlySavings: audit.total_monthly_savings,
        annualSavings: audit.total_annual_savings,
        auditId,
        aiSummary: audit.ai_summary || '',
      });
    } catch (emailErr) {
      console.error('[leads] Email send failed:', emailErr);
      // Don't fail the request if email fails
    }

    return res.json({ success: true });
  } catch (err) {
    console.error('[POST /api/leads]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

import { Router, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { supabase } from '../lib/supabase';
import { generateAuditSummary } from '../lib/groq';

export const auditRouter = Router();

const auditLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { error: 'Too many requests. Please try again in 15 minutes.' },
});

auditRouter.post('/', auditLimiter, async (req: Request, res: Response) => {
  try {
    const { teamSize, useCase, toolsInput } = req.body;

    if (!teamSize || !useCase || !toolsInput || !Array.isArray(toolsInput)) {
      return res.status(400).json({ error: 'Missing required fields: teamSize, useCase, toolsInput' });
    }

    // Run audit engine
    const { runAuditEngine } = await import('../lib/auditEngine');
    const results = runAuditEngine({ teamSize, useCase, toolsInput });

    const totalMonthlySavings = results.reduce((sum, r) => sum + r.savings, 0);
    const totalAnnualSavings = totalMonthlySavings * 12;

    // Generate AI summary (with fallback)
    const aiSummary = await generateAuditSummary({
      teamSize,
      useCase,
      totalMonthlySavings,
      totalAnnualSavings,
      results,
    });

    // Save to Supabase
    const { data, error } = await supabase
      .from('audits')
      .insert({
        team_size: teamSize,
        use_case: useCase,
        tools_input: toolsInput,
        results,
        total_monthly_savings: totalMonthlySavings,
        total_annual_savings: totalAnnualSavings,
        ai_summary: aiSummary,
      })
      .select('id')
      .single();

    if (error) throw error;

    return res.json({
      auditId: data.id,
      results,
      totalMonthlySavings,
      totalAnnualSavings,
      aiSummary,
    });
  } catch (err) {
    console.error('[POST /api/audit]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET a saved audit by ID (for shareable URLs)
auditRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('audits')
      .select('id, created_at, team_size, use_case, results, total_monthly_savings, total_annual_savings, ai_summary')
      .eq('id', req.params.id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Audit not found' });
    }

    return res.json(data);
  } catch (err) {
    console.error('[GET /api/audit/:id]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

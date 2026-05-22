import { useState, useEffect } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import LeadCapture from '../components/LeadCapture'
import { getToolById } from '../lib/pricingData'

interface AuditResultData {
  auditId: string
  results: Array<{
    tool: string
    currentSpend: number
    currentPlan: string
    recommendedAction: 'keep' | 'downgrade' | 'switch' | 'cancel'
    recommendedPlan?: string
    recommendedTool?: string
    savings: number
    reason: string
    credexAngle?: string
  }>
  totalMonthlySavings: number
  totalAnnualSavings: number
  aiSummary: string
}

const ACTION_CONFIG = {
  keep:      { color: '#10b981', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.2)',  label: '✓ Optimised'  },
  downgrade: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.2)',  label: '↓ Downgrade'  },
  switch:    { color: '#a78bfa', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.2)', label: '⇄ Switch Tool' },
  cancel:    { color: '#ef4444', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.2)',   label: '✕ Cancel'     },
}

export default function AuditResult() {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const [data, setData] = useState<AuditResultData | null>(location.state as AuditResultData || null)
  const [loading, setLoading] = useState(!location.state)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [showLeadCapture, setShowLeadCapture] = useState(false)
  const [leadSubmitted, setLeadSubmitted] = useState(false)

  // If navigating directly to shared URL, fetch from API
  useEffect(() => {
    if (!data && id) {
      fetch(`/api/audit/${id}`)
        .then(r => r.json())
        .then(d => {
          setData({
            auditId: d.id,
            results: d.results,
            totalMonthlySavings: d.total_monthly_savings,
            totalAnnualSavings: d.total_annual_savings,
            aiSummary: d.ai_summary,
          })
          setLoading(false)
        })
        .catch(() => {
          setError('Audit not found or expired.')
          setLoading(false)
        })
    }
  }, [id, data])

  // Show lead capture after 2 seconds
  useEffect(() => {
    if (data && !leadSubmitted) {
      const timer = setTimeout(() => setShowLeadCapture(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [data, leadSubmitted])

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px', height: '48px', margin: '0 auto 16px',
            border: '3px solid rgba(124,58,237,0.3)',
            borderTopColor: '#7c3aed',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }} />
          <p style={{ color: 'var(--color-text-muted)' }}>Loading audit...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#fca5a5', marginBottom: '16px' }}>{error || 'Audit not found'}</p>
          <Link to="/" style={{ color: 'var(--color-brand-light)', textDecoration: 'none' }}>
            ← Run a new audit
          </Link>
        </div>
      </div>
    )
  }

  const isHighSavings = data.totalMonthlySavings > 500
  const hasNoSavings = data.totalMonthlySavings === 0

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      {/* Background */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{
          position: 'absolute', top: '-20%', right: '-10%',
          width: '600px', height: '600px',
          background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto', padding: '40px 24px 80px' }}>
        {/* Nav */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <span style={{ fontSize: '20px' }}>🔍</span>
            <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-brand-light)' }}>SpendLens</span>
          </Link>
          <button
            id="share-btn"
            onClick={handleCopy}
            style={{
              padding: '10px 20px',
              background: copied ? 'rgba(16,185,129,0.15)' : 'var(--color-surface)',
              border: `1px solid ${copied ? 'rgba(16,185,129,0.4)' : 'var(--color-border)'}`,
              borderRadius: '8px',
              color: copied ? '#10b981' : 'var(--color-text)',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            {copied ? '✓ Copied!' : '🔗 Share Audit'}
          </button>
        </div>

        {/* Hero savings */}
        <div className="glass-card animate-fade-in-up" style={{
          padding: '40px',
          textAlign: 'center',
          marginBottom: '24px',
          ...(isHighSavings ? { animation: 'pulse-glow 2s ease-in-out infinite' } : {}),
        }}>
          {hasNoSavings ? (
            <>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🏆</div>
              <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#10b981', margin: '0 0 8px' }}>
                You're spending well!
              </h1>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '16px', margin: 0 }}>
                No obvious waste detected in your current AI tool setup.
              </p>
            </>
          ) : (
            <>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '2px', margin: '0 0 8px' }}>
                Potential Monthly Savings
              </p>
              <div className="gradient-text" style={{ fontSize: 'clamp(48px, 10vw, 80px)', fontWeight: 900, lineHeight: 1, margin: '0 0 8px' }}>
                ${data.totalMonthlySavings.toFixed(0)}
              </div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '16px', margin: '0 0 16px' }}>
                per month · <strong style={{ color: 'var(--color-brand-light)' }}>${data.totalAnnualSavings.toFixed(0)}/year</strong>
              </p>
            </>
          )}
        </div>

        {/* AI Summary */}
        <div className="glass-card" style={{ padding: '24px 28px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span style={{ fontSize: '16px' }}>🤖</span>
            <span style={{ fontSize: '13px', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              AI Analysis
            </span>
            <span style={{
              fontSize: '11px', padding: '2px 8px',
              background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)',
              borderRadius: '20px', color: 'var(--color-brand-light)',
            }}>
              Powered by Groq
            </span>
          </div>
          <p style={{ color: 'var(--color-text)', lineHeight: 1.8, margin: 0, fontSize: '15px' }}>
            {data.aiSummary}
          </p>
        </div>

        {/* Per-tool breakdown */}
        <h2 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px', margin: '32px 0 16px' }}>
          Tool-by-Tool Breakdown
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
          {data.results.map((result, i) => {
            const tool = getToolById(result.tool)
            const config = ACTION_CONFIG[result.recommendedAction]
            return (
              <div key={i} className="glass-card" style={{ padding: '20px 24px', borderColor: config.border }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '22px' }}>{tool?.emoji || '🔧'}</span>
                    <div>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: '15px' }}>{tool?.name || result.tool}</p>
                      <p style={{ margin: '2px 0 0', fontSize: '13px', color: 'var(--color-text-muted)' }}>
                        {result.currentPlan} plan · ${result.currentSpend}/mo
                      </p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{
                      display: 'inline-block', padding: '4px 12px',
                      background: config.bg, border: `1px solid ${config.border}`,
                      borderRadius: '20px', color: config.color, fontSize: '13px', fontWeight: 600,
                      marginBottom: '4px',
                    }}>
                      {config.label}
                    </span>
                    {result.savings > 0 && (
                      <p style={{ margin: '4px 0 0', color: '#10b981', fontSize: '14px', fontWeight: 700 }}>
                        Save ${result.savings.toFixed(0)}/mo
                      </p>
                    )}
                  </div>
                </div>
                <p style={{ margin: '12px 0 0', fontSize: '14px', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                  {result.reason}
                </p>
                {result.recommendedTool && (
                  <p style={{ margin: '6px 0 0', fontSize: '13px', color: 'var(--color-brand-light)' }}>
                    → Switch to: {getToolById(result.recommendedTool)?.name || result.recommendedTool} ({result.recommendedPlan})
                  </p>
                )}
                {result.credexAngle && (
                  <div style={{
                    marginTop: '10px', padding: '10px 14px',
                    background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)',
                    borderRadius: '8px', fontSize: '13px', color: 'var(--color-brand-light)',
                  }}>
                    💡 {result.credexAngle}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* High savings CTA */}
        {isHighSavings && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(79,70,229,0.2))',
            border: '1px solid rgba(124,58,237,0.4)',
            borderRadius: '16px',
            padding: '28px 32px',
            marginBottom: '24px',
            textAlign: 'center',
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 8px' }}>
              💸 Save even more with Credex
            </h3>
            <p style={{ color: 'var(--color-text-muted)', margin: '0 0 20px', lineHeight: 1.7 }}>
              At ${data.totalMonthlySavings.toFixed(0)}/mo in savings identified, you're spending significantly on AI.
              Credex offers discounted AI API credits — helping startups save an additional 20–40%.
            </p>
            <a
              href="https://credex.ai"
              target="_blank"
              rel="noopener noreferrer"
              id="credex-cta-btn"
              style={{
                display: 'inline-block',
                padding: '14px 28px',
                background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                color: 'white',
                borderRadius: '10px',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '15px',
              }}
            >
              Learn about Credex →
            </a>
          </div>
        )}

        {/* Run another audit */}
        <div style={{ textAlign: 'center' }}>
          <Link
            to="/"
            id="run-another-btn"
            style={{
              display: 'inline-block',
              padding: '14px 28px',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text)',
              borderRadius: '10px',
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            ← Run another audit
          </Link>
        </div>
      </div>

      {/* Lead capture modal */}
      {showLeadCapture && !leadSubmitted && (
        <LeadCapture
          auditId={data.auditId}
          monthlySavings={data.totalMonthlySavings}
          onSubmit={() => {
            setLeadSubmitted(true)
            setShowLeadCapture(false)
          }}
          onDismiss={() => setShowLeadCapture(false)}
        />
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SpendForm from '../components/SpendForm'
import { TOOLS } from '../lib/pricingData'

const STORAGE_KEY = 'spendlens_form_state'

export interface ToolEntry {
  tool: string
  plan: string
  seats: number
  monthlySpend: number
}

export interface FormState {
  teamSize: number
  useCase: string
  tools: ToolEntry[]
}

const DEFAULT_FORM: FormState = {
  teamSize: 3,
  useCase: 'coding',
  tools: [
    { tool: 'cursor', plan: 'pro', seats: 1, monthlySpend: 20 },
  ],
}

export default function Home() {
  const navigate = useNavigate()
  const [formState, setFormState] = useState<FormState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : DEFAULT_FORM
    } catch {
      return DEFAULT_FORM
    }
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Persist form state to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formState))
  }, [formState])

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    try {
      const payload = {
        teamSize: formState.teamSize,
        useCase: formState.useCase,
        toolsInput: formState.tools.map(t => ({
          tool: t.tool,
          plan: t.plan,
          seats: t.seats,
          monthlySpend: t.monthlySpend,
        })),
      }

      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Audit failed')
      }

      const data = await res.json()
      // Clear saved form state after successful audit
      localStorage.removeItem(STORAGE_KEY)
      navigate(`/audit/${data.auditId}`, { state: data })
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const totalSpend = formState.tools.reduce((sum, t) => sum + t.monthlySpend, 0)

  return (
    <main role="main" aria-label="SpendLens AI Spend Audit" style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      {/* Background orbs */}
      <div style={{
        position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0
      }}>
        <div style={{
          position: 'absolute', top: '-20%', left: '-10%',
          width: '600px', height: '600px',
          background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
        <div style={{
          position: 'absolute', bottom: '-20%', right: '-10%',
          width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '860px', margin: '0 auto', padding: '40px 24px 80px' }}>
        {/* Header */}
        <header role="banner" style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <span style={{ fontSize: '32px' }}>🔍</span>
            <span style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-brand-light)' }}>SpendLens</span>
          </div>

          <h1 className="gradient-text" style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800, lineHeight: 1.15, margin: '0 0 16px' }}>
            Are you overpaying<br />on AI tools?
          </h1>
          <p style={{ fontSize: '18px', color: 'var(--color-text-muted)', maxWidth: '520px', margin: '0 auto 32px', lineHeight: 1.7 }}>
            Enter what your team pays for AI tools. Get an instant audit with specific savings recommendations — free, no signup.
          </p>

          {/* Social proof bar */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', flexWrap: 'wrap' }}>
            {[
              { icon: '⚡', text: 'Instant results' },
              { icon: '🔒', text: 'No data sold' },
              { icon: '💸', text: 'Avg. $340/mo saved' },
            ].map(item => (
              <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-muted)', fontSize: '14px' }}>
                <span>{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </header>

        {/* Main form card */}
        <div className="glass-card glow main-form-card">
          <SpendForm
            formState={formState}
            onChange={setFormState}
          />

          {/* Current total spend summary */}
          {totalSpend > 0 && (
            <div style={{
              margin: '32px 0 0',
              padding: '20px 24px',
              background: 'rgba(124, 58, 237, 0.08)',
              border: '1px solid rgba(124, 58, 237, 0.2)',
              borderRadius: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
            }}>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
                Current monthly AI spend
              </span>
              <span style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-brand-light)' }}>
                ${totalSpend.toFixed(0)}/mo
              </span>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div style={{
              marginTop: '16px',
              padding: '14px 18px',
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '10px',
              color: '#fca5a5',
              fontSize: '14px',
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Submit button */}
          <button
            id="run-audit-btn"
            aria-label="Run free AI spend audit"
            onClick={handleSubmit}
            disabled={loading || formState.tools.length === 0 || totalSpend === 0}
            style={{
              marginTop: '32px',
              width: '100%',
              padding: '18px',
              background: loading ? 'var(--color-surface-2)' : 'linear-gradient(135deg, #7c3aed, #4f46e5)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 700,
              letterSpacing: '0.5px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <span style={{
                  width: '18px', height: '18px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: 'white',
                  borderRadius: '50%',
                  display: 'inline-block',
                  animation: 'spin 0.7s linear infinite',
                }} />
                Analysing your spend...
              </span>
            ) : (
              '🔍 Run Free Audit →'
            )}
          </button>

          <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '12px', marginTop: '12px' }}>
            Takes ~5 seconds • No credit card • No email required to see results
          </p>
        </div>

        {/* Tools supported */}
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', marginBottom: '16px' }}>
            Supports {TOOLS.length} AI tools including
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {TOOLS.slice(0, 6).map(t => (
              <span key={t.id} style={{
                padding: '6px 14px',
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: '20px',
                fontSize: '13px',
                color: 'var(--color-text-muted)',
              }}>
                {t.emoji} {t.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  )
}

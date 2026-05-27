import { useState } from 'react'

interface Props {
  auditId: string
  monthlySavings: number
  onSubmit: () => void
  onDismiss: () => void
}

export default function LeadCapture({ auditId, monthlySavings, onSubmit, onDismiss }: Props) {
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          companyName: company,
          auditId,
          // Honeypot field (not shown to user)
          website: '',
        }),
      })

      if (!res.ok) throw new Error('Failed to submit')
      onSubmit()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div role="dialog" aria-modal="true" aria-label="Get your full audit report" style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      zIndex: 100,
      animation: 'fadeInUp 0.3s ease-out',
    }}>
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '440px',
        padding: '36px',
        position: 'relative',
      }}>
        <button
          aria-label="Close dialog"
          onClick={onDismiss}
          style={{
            position: 'absolute', top: '16px', right: '16px',
            background: 'transparent', border: 'none',
            color: 'var(--color-text-muted)', fontSize: '20px',
            width: '32px', height: '32px',
          }}
        >
          ×
        </button>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>📬</div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 8px' }}>
            Get your full report
          </h2>
          {monthlySavings > 0 ? (
            <p style={{ color: 'var(--color-text-muted)', margin: 0, fontSize: '14px' }}>
              We'll email you a full breakdown of your <strong style={{ color: 'var(--color-brand-light)' }}>
                ${monthlySavings.toFixed(0)}/mo savings
              </strong> — plus tips on reducing AI spend.
            </p>
          ) : (
            <p style={{ color: 'var(--color-text-muted)', margin: 0, fontSize: '14px' }}>
              Get notified when new AI tools or pricing changes affect your setup.
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Honeypot (hidden from users, catches bots) */}
          <input
            type="text"
            name="website"
            style={{ display: 'none' }}
            tabIndex={-1}
            autoComplete="off"
          />

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '6px' }}>
              Work email *
            </label>
            <input
              id="lead-email-input"
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@company.com"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '6px' }}>
              Company name <span style={{ color: 'var(--color-text-muted)' }}>(optional)</span>
            </label>
            <input
              id="lead-company-input"
              type="text"
              value={company}
              onChange={e => setCompany(e.target.value)}
              placeholder="Acme Inc."
            />
          </div>

          {error && (
            <div style={{ marginBottom: '12px', color: '#fca5a5', fontSize: '13px' }}>
              ⚠️ {error}
            </div>
          )}

          <button
            id="lead-submit-btn"
            type="submit"
            disabled={loading || !email}
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: 700,
            }}
          >
            {loading ? 'Sending...' : '📧 Send me the report'}
          </button>

          <button
            type="button"
            onClick={onDismiss}
            style={{
              width: '100%',
              padding: '12px',
              background: 'transparent',
              border: 'none',
              color: 'var(--color-text-muted)',
              fontSize: '13px',
              marginTop: '8px',
            }}
          >
            No thanks, I'll just view it here
          </button>
        </form>

        <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '11px', margin: '16px 0 0' }}>
          No spam. Unsubscribe anytime. Your data is never sold.
        </p>
      </div>
    </div>
  )
}

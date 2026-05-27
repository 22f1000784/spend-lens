import { useState } from 'react'
import { TOOLS, getToolById } from '../lib/pricingData'
import type { FormState, ToolEntry } from '../pages/Home'

interface Props {
  formState: FormState
  onChange: (state: FormState) => void
}

const USE_CASES = [
  { id: 'coding', label: '💻 Coding / Development' },
  { id: 'writing', label: '✍️ Writing / Content' },
  { id: 'research', label: '🔬 Research / Analysis' },
  { id: 'data', label: '📊 Data Science' },
  { id: 'mixed', label: '🔀 Mixed / General' },
]


export default function SpendForm({ formState, onChange }: Props) {
  const [showAddTool, setShowAddTool] = useState(false)

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    onChange({ ...formState, [key]: value })
  }

  const updateTool = (index: number, field: keyof ToolEntry, value: string | number) => {
    const tools = [...formState.tools]
    tools[index] = { ...tools[index], [field]: value }

    // Auto-fill spend when plan changes (for subscription tools)
    if (field === 'plan' || field === 'tool') {
      const tool = getToolById(tools[index].tool)
      const plan = tool?.plans.find(p => p.id === (field === 'plan' ? value : tools[index].plan))
      if (plan && plan.pricePerSeat > 0) {
        tools[index].monthlySpend = plan.pricePerSeat * tools[index].seats
      }
    }
    if (field === 'seats') {
      const tool = getToolById(tools[index].tool)
      const plan = tool?.plans.find(p => p.id === tools[index].plan)
      if (plan && plan.pricePerSeat > 0) {
        tools[index].monthlySpend = plan.pricePerSeat * Number(value)
      }
    }

    onChange({ ...formState, tools })
  }

  const addTool = (toolId: string) => {
    const tool = getToolById(toolId)
    if (!tool) return
    const defaultPlan = tool.plans[0]
    const newEntry: ToolEntry = {
      tool: toolId,
      plan: defaultPlan.id,
      seats: 1,
      monthlySpend: defaultPlan.pricePerSeat,
    }
    onChange({ ...formState, tools: [...formState.tools, newEntry] })
    setShowAddTool(false)
  }

  const removeTool = (index: number) => {
    onChange({ ...formState, tools: formState.tools.filter((_, i) => i !== index) })
  }

  const availableToAdd = TOOLS.filter(t => !formState.tools.find(ft => ft.tool === t.id))

  return (
    <div>
      {/* Section: Team info */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>
          1 — Team Profile
        </h2>
        <div className="team-profile-grid">
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '6px' }}>
              Team Size (people)
            </label>
            <input
              id="team-size-input"
              type="number"
              min={1}
              max={500}
              value={formState.teamSize || ''}
              onChange={e => {
                const val = e.target.value;
                updateField('teamSize', val === '' ? '' as any : Number(val));
              }}
              onBlur={() => {
                if (!formState.teamSize || formState.teamSize < 1) {
                  updateField('teamSize', 1);
                }
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '6px' }}>
              Primary Use Case
            </label>
            <select
              id="use-case-select"
              value={formState.useCase}
              onChange={e => updateField('useCase', e.target.value)}
            >
              {USE_CASES.map(uc => (
                <option key={uc.id} value={uc.id}>{uc.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Section: Tools */}
      <div>
        <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>
          2 — AI Tools You Pay For
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {formState.tools.map((entry, index) => {
            const tool = getToolById(entry.tool)
            return (
              <div key={`${entry.tool}-${index}`} style={{
                background: 'var(--color-surface-2)',
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
                padding: '16px 20px',
              }}>
                <div className="tool-grid-row">
                  {/* Tool selector */}
                  <select
                    className="tool-grid-select-tool"
                    value={entry.tool}
                    onChange={e => updateTool(index, 'tool', e.target.value)}
                  >
                    {TOOLS.map(t => (
                      <option key={t.id} value={t.id}>{t.emoji} {t.name}</option>
                    ))}
                  </select>

                  {/* Plan selector */}
                  <select
                    className="tool-grid-select-plan"
                    value={entry.plan}
                    onChange={e => updateTool(index, 'plan', e.target.value)}
                  >
                    {tool?.plans.map(p => (
                      <option key={p.id} value={p.id}>{p.label}</option>
                    ))}
                  </select>

                  {/* Seats */}
                  <input
                    className="tool-grid-input-seats"
                    type="number"
                    min={1}
                    max={500}
                    value={entry.seats || ''}
                    onChange={e => {
                      const val = e.target.value;
                      updateTool(index, 'seats', val === '' ? '' as any : Number(val));
                    }}
                    onBlur={() => {
                      if (!entry.seats || entry.seats < 1) {
                        updateTool(index, 'seats', 1);
                      }
                    }}
                    placeholder="Seats"
                    title="Number of seats"
                  />

                  {/* Monthly spend */}
                  <div className="tool-grid-spend-container" style={{ position: 'relative' }}>
                    <span style={{
                      position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                      color: 'var(--color-text-muted)', fontSize: '14px',
                    }}>$</span>
                    <input
                      type="number"
                      min={0}
                      value={entry.monthlySpend === 0 ? '' : entry.monthlySpend}
                      onChange={e => {
                        const val = e.target.value;
                        updateTool(index, 'monthlySpend', val === '' ? 0 : Number(val));
                      }}
                      style={{ paddingLeft: '24px' }}
                      placeholder="0"
                      title="Monthly spend in USD"
                    />
                  </div>

                  {/* Remove */}
                  <button
                    className="tool-grid-btn-remove"
                    onClick={() => removeTool(index)}
                    title="Remove tool"
                    style={{
                      background: 'transparent',
                      border: '1px solid rgba(239,68,68,0.3)',
                      color: '#ef4444',
                      borderRadius: '8px',
                      width: '36px',
                      height: '36px',
                      fontSize: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    ×
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Add tool */}
        {availableToAdd.length > 0 && (
          <div style={{ marginTop: '12px' }}>
            {showAddTool ? (
              <div style={{
                background: 'var(--color-surface-2)',
                border: '1px dashed var(--color-border)',
                borderRadius: '12px',
                padding: '16px 20px',
              }}>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', marginBottom: '12px' }}>
                  Select a tool to add:
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {availableToAdd.map(t => (
                    <button
                      key={t.id}
                      id={`add-tool-${t.id}`}
                      onClick={() => addTool(t.id)}
                      style={{
                        padding: '8px 16px',
                        background: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '20px',
                        color: 'var(--color-text)',
                        fontSize: '13px',
                      }}
                    >
                      {t.emoji} {t.name}
                    </button>
                  ))}
                  <button
                    onClick={() => setShowAddTool(false)}
                    style={{
                      padding: '8px 16px',
                      background: 'transparent',
                      border: '1px solid transparent',
                      color: 'var(--color-text-muted)',
                      fontSize: '13px',
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                id="add-tool-btn"
                onClick={() => setShowAddTool(true)}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: 'transparent',
                  border: '1px dashed var(--color-border)',
                  borderRadius: '12px',
                  color: 'var(--color-text-muted)',
                  fontSize: '14px',
                  marginTop: '4px',
                }}
              >
                + Add another tool
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

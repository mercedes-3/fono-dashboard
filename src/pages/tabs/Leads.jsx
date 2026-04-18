import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { formatDistanceToNow, format } from 'date-fns'

function PageTitle({ title, sub, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
      <div>
        <div style={{ fontSize: 10, color: 'var(--text-4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Fono</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 300, color: 'var(--text)', letterSpacing: '-0.01em', lineHeight: 1 }}>{title}</h1>
        {sub && <p style={{ fontSize: 11, color: 'var(--text-4)', marginTop: 8, letterSpacing: '0.02em' }}>{sub}</p>}
      </div>
      {action}
    </div>
  )
}

function Pill({ label, active, onClick, count }) {
  return (
    <button onClick={onClick} style={{
      padding: '4px 14px', borderRadius: 99, fontSize: 10, fontWeight: 500,
      letterSpacing: '0.06em', textTransform: 'uppercase',
      background: active ? 'rgba(232,232,232,0.08)' : 'transparent',
      color: active ? 'var(--platinum-2)' : 'var(--text-4)',
      border: `1px solid ${active ? 'rgba(232,232,232,0.16)' : 'var(--border)'}`,
      cursor: 'pointer', transition: 'all 0.12s',
      display: 'flex', alignItems: 'center', gap: 6,
    }}>
      {label}
      {count > 0 && <span style={{ fontSize: 9, opacity: 0.7 }}>({count})</span>}
    </button>
  )
}

const PIPELINE_STAGES = [
  { value: 'new', label: 'New', color: 'var(--text-4)', bg: 'var(--black-5)', border: 'var(--border)' },
  { value: 'contacted', label: 'Contacted', color: 'var(--amber)', bg: 'var(--amber-dim)', border: 'rgba(251,191,36,0.15)' },
  { value: 'quoted', label: 'Quoted', color: 'var(--platinum)', bg: 'rgba(232,232,232,0.06)', border: 'rgba(232,232,232,0.12)' },
  { value: 'won', label: 'Won', color: 'var(--green)', bg: 'var(--green-dim)', border: 'rgba(74,222,128,0.15)' },
  { value: 'lost', label: 'Lost', color: 'var(--red)', bg: 'var(--red-dim)', border: 'rgba(248,113,113,0.15)' },
]

function PipelineTag({ stage }) {
  const s = PIPELINE_STAGES.find(p => p.value === stage) || PIPELINE_STAGES[0]
  return (
    <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 99, background: s.bg, color: s.color, border: `1px solid ${s.border}`, whiteSpace: 'nowrap' }}>
      {s.label}
    </span>
  )
}

function SourceTag({ lead }) {
  const isWeb = lead.phone?.startsWith('web_')
  const isVoice = lead.source === 'voice'
  return (
    <span style={{
      fontSize: 9, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
      padding: '3px 8px', borderRadius: 99, border: '1px solid var(--border)',
      background: isWeb ? 'var(--green-dim)' : 'rgba(232,232,232,0.06)',
      color: isWeb ? 'var(--green)' : 'var(--platinum-3)',
    }}>
      {isVoice ? 'voice' : isWeb ? 'chat' : lead.source || 'sms'}
    </span>
  )
}

function ScoreBar({ score }) {
  const s = score || 0
  const color = s >= 70 ? 'var(--green)' : s >= 40 ? 'var(--amber)' : 'var(--text-4)'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ width: 32, height: 4, borderRadius: 99, background: 'var(--black-5)', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${s}%`, borderRadius: 99, background: color }} />
      </div>
      <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color }}>{s}</span>
    </div>
  )
}

function ScoreLabel({ score }) {
  const s = score || 0
  const color = s >= 70 ? 'var(--green)' : s >= 40 ? 'var(--amber)' : 'var(--text-4)'
  const label = s >= 70 ? 'Hot' : s >= 40 ? 'Warm' : 'Cold'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 48, height: 5, borderRadius: 99, background: 'var(--black-5)', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${s}%`, borderRadius: 99, background: color }} />
      </div>
      <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color }}>{s}/100</span>
      <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '2px 8px', borderRadius: 99, background: s >= 70 ? 'var(--green-dim)' : s >= 40 ? 'var(--amber-dim)' : 'var(--black-5)', color, border: `1px solid ${s >= 70 ? 'rgba(74,222,128,0.15)' : s >= 40 ? 'rgba(251,191,36,0.15)' : 'var(--border)'}` }}>{label}</span>
    </div>
  )
}

// ─── Customer Detail Panel ────────────────────────────────────────────────────

function CustomerDetail({ lead, onClose, onUpdate, messages }) {
  const [notes, setNotes] = useState(lead.notes || '')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState(lead.tags || [])
  const [stage, setStage] = useState(lead.pipeline_stage || 'new')
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  useEffect(() => {
    setNotes(lead.notes || '')
    setTags(lead.tags || [])
    setStage(lead.pipeline_stage || 'new')
  }, [lead])

  async function save() {
    setSaving(true)
    setSaveMsg('')
    const { error } = await supabase.from('leads').update({
      notes,
      tags,
      pipeline_stage: stage,
      updated_at: new Date().toISOString(),
    }).eq('id', lead.id)
    if (error) setSaveMsg(`Error: ${error.message}`)
    else {
      setSaveMsg('Saved')
      setTimeout(() => setSaveMsg(''), 2000)
      onUpdate()
    }
    setSaving(false)
  }

  function addTag() {
    const t = tagInput.trim().toLowerCase()
    if (t && !tags.includes(t)) {
      setTags([...tags, t])
      setTagInput('')
    }
  }

  function removeTag(t) {
    setTags(tags.filter(tag => tag !== t))
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 999,
      background: 'rgba(0,0,0,0.85)',
      display: 'flex', justifyContent: 'flex-end',
    }}>
      <div onClick={onClose} style={{ flex: 1 }} />
      <div style={{
        width: '100%', maxWidth: 520,
        background: 'var(--black-2)',
        borderLeft: '1px solid var(--border)',
        overflowY: 'auto',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 9, color: 'var(--text-4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Customer</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 300, color: 'var(--text)', marginBottom: 4 }}>
              {lead.full_name || 'Unknown'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-4)', fontFamily: 'var(--font-mono)' }}>
              {lead.phone?.startsWith('web_') ? 'Web chat' : lead.phone || 'No phone'}
            </div>
          </div>
          <button onClick={onClose} style={{
            width: 28, height: 28, borderRadius: 6,
            background: 'var(--black-4)', border: '1px solid var(--border)',
            color: 'var(--text-4)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14,
          }}>
            ✕
          </button>
        </div>

        {/* Lead Score */}
        <div style={{ padding: '16px 28px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontSize: 9, color: 'var(--text-4)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>Lead Score</div>
          <ScoreLabel score={lead.lead_score} />
        </div>

        {/* Pipeline Stage */}
        <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontSize: 9, color: 'var(--text-4)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>Pipeline Stage</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {PIPELINE_STAGES.map(p => (
              <button key={p.value} onClick={() => setStage(p.value)} style={{
                padding: '6px 14px', borderRadius: 99, fontSize: 10, fontWeight: 500,
                letterSpacing: '0.04em',
                background: stage === p.value ? p.bg : 'transparent',
                color: stage === p.value ? p.color : 'var(--text-4)',
                border: `1px solid ${stage === p.value ? p.border : 'var(--border)'}`,
                cursor: 'pointer', transition: 'all 0.12s',
              }}>
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Lead Details */}
        <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontSize: 9, color: 'var(--text-4)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>Details</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              ['Address', lead.service_address],
              ['Service', lead.service_type],
              ['Issue', lead.issue_summary],
              ['Preferred Time', lead.preferred_time_text],
              ['Source', lead.source || 'sms'],
              ['Created', lead.created_at ? format(new Date(lead.created_at), 'MMM d, yyyy h:mm a') : '—'],
            ].map(([label, value]) => (
              <div key={label} style={{ display: 'flex', gap: 14 }}>
                <span style={{ fontSize: 9, color: 'var(--text-4)', width: 90, flexShrink: 0, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', paddingTop: 2 }}>{label}</span>
                <span style={{ fontSize: 12, color: value ? 'var(--text)' : 'var(--text-4)', lineHeight: 1.5 }}>{value || '—'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontSize: 9, color: 'var(--text-4)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>Tags</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: tags.length > 0 ? 10 : 0 }}>
            {tags.map(t => (
              <span key={t} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '4px 10px', borderRadius: 99, fontSize: 10,
                background: 'rgba(232,232,232,0.06)', color: 'var(--platinum-3)',
                border: '1px solid rgba(232,232,232,0.1)',
              }}>
                {t}
                <span onClick={() => removeTag(t)} style={{ cursor: 'pointer', opacity: 0.5, fontSize: 12 }}>✕</span>
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addTag()}
              placeholder="Add tag..."
              style={{
                flex: 1, background: 'var(--black-4)', border: '1px solid var(--border-2)',
                borderRadius: 8, padding: '7px 10px', color: 'var(--text)', fontSize: 11,
                outline: 'none', fontFamily: 'inherit',
              }}
            />
            <button onClick={addTag} style={{
              padding: '7px 14px', borderRadius: 8, fontSize: 10, fontWeight: 500,
              background: 'var(--black-4)', color: 'var(--text-4)',
              border: '1px solid var(--border)', cursor: 'pointer',
            }}>Add</button>
          </div>
        </div>

        {/* Notes */}
        <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontSize: 9, color: 'var(--text-4)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>Notes</div>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Add notes about this customer..."
            rows={4}
            style={{
              width: '100%', background: 'var(--black-4)', border: '1px solid var(--border-2)',
              borderRadius: 8, padding: '10px 12px', color: 'var(--text)', fontSize: 12,
              outline: 'none', fontFamily: 'inherit', resize: 'vertical', lineHeight: 1.6,
            }}
          />
        </div>

        {/* Conversation History */}
        <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--border)', flex: 1 }}>
          <div style={{ fontSize: 9, color: 'var(--text-4)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>Conversation History</div>
          {messages.length === 0 ? (
            <div style={{ fontSize: 11, color: 'var(--text-4)', padding: '12px 0' }}>No messages yet</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 300, overflowY: 'auto' }}>
              {messages.map((m, i) => (
                <div key={i} style={{
                  padding: '10px 12px',
                  background: m.direction === 'inbound' ? 'var(--black-4)' : 'rgba(232,232,232,0.04)',
                  borderRadius: 8,
                  border: '1px solid var(--border)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 9, fontWeight: 600, color: m.direction === 'inbound' ? 'var(--amber)' : 'var(--green)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      {m.direction === 'inbound' ? 'Customer' : 'Fono AI'}
                    </span>
                    <span style={{ fontSize: 9, color: 'var(--text-4)', fontFamily: 'var(--font-mono)' }}>
                      {m.created_at ? format(new Date(m.created_at), 'h:mm a') : ''}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text)', lineHeight: 1.5 }}>{m.body}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Save bar */}
        <div style={{ padding: '16px 28px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {saveMsg && (
            <span style={{ fontSize: 11, color: saveMsg === 'Saved' ? 'var(--green)' : 'var(--red)' }}>{saveMsg}</span>
          )}
          <div style={{ flex: 1 }} />
          <button onClick={save} disabled={saving} style={{
            padding: '9px 20px', borderRadius: 8, fontSize: 11, fontWeight: 500,
            background: 'var(--platinum)', color: 'var(--black)',
            border: 'none', cursor: 'pointer', letterSpacing: '0.02em',
            opacity: saving ? 0.6 : 1,
          }}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Leads({ tenant }) {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [messages, setMessages] = useState([])
  const [filter, setFilter] = useState('all')
  const [view, setView] = useState('list')

  useEffect(() => { if (tenant?.id) load() }, [tenant])

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('leads').select('*').eq('tenant_id', tenant.id).order('created_at', { ascending: false })
    setLeads(data || [])
    setLoading(false)
  }

  async function openDetail(lead) {
    setSelected(lead)
    const { data } = await supabase.from('messages')
      .select('*')
      .eq('lead_id', lead.id)
      .order('created_at', { ascending: true })
    setMessages(data || [])
  }

  function closeDetail() {
    setSelected(null)
    setMessages([])
  }

  const filtered = leads.filter(l => {
    if (filter === 'sms') return !l.phone?.startsWith('web_') && l.source !== 'voice'
    if (filter === 'voice') return l.source === 'voice'
    if (filter === 'chat') return l.phone?.startsWith('web_')
    if (filter === 'new') return (l.pipeline_stage || 'new') === 'new'
    if (filter === 'contacted') return l.pipeline_stage === 'contacted'
    if (filter === 'quoted') return l.pipeline_stage === 'quoted'
    if (filter === 'won') return l.pipeline_stage === 'won'
    if (filter === 'lost') return l.pipeline_stage === 'lost'
    if (filter === 'hot') return (l.lead_score || 0) >= 70
    return true
  })

  const stageCounts = leads.reduce((acc, l) => {
    const s = l.pipeline_stage || 'new'
    acc[s] = (acc[s] || 0) + 1
    return acc
  }, {})

  const hotCount = leads.filter(l => (l.lead_score || 0) >= 70).length

  return (
    <div style={{ padding: 40, maxWidth: 1100 }}>
      <PageTitle
        title="Leads"
        sub={`${leads.length} total · ${stageCounts.won || 0} won · ${stageCounts.new || 0} new · ${hotCount} hot`}
        action={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* View toggle */}
            <div style={{ display: 'flex', background: 'var(--black-4)', borderRadius: 8, padding: 3, border: '1px solid var(--border)' }}>
              <button onClick={() => setView('list')} style={{
                padding: '5px 12px', borderRadius: 6, fontSize: 10, fontWeight: 500,
                background: view === 'list' ? 'var(--black-5)' : 'transparent',
                color: view === 'list' ? 'var(--text)' : 'var(--text-4)',
                border: view === 'list' ? '1px solid var(--border-2)' : '1px solid transparent',
                cursor: 'pointer', letterSpacing: '0.04em',
              }}>List</button>
              <button onClick={() => setView('pipeline')} style={{
                padding: '5px 12px', borderRadius: 6, fontSize: 10, fontWeight: 500,
                background: view === 'pipeline' ? 'var(--black-5)' : 'transparent',
                color: view === 'pipeline' ? 'var(--text)' : 'var(--text-4)',
                border: view === 'pipeline' ? '1px solid var(--border-2)' : '1px solid transparent',
                cursor: 'pointer', letterSpacing: '0.04em',
              }}>Pipeline</button>
            </div>

            <button onClick={load} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, fontSize: 11, fontWeight: 500, color: 'var(--text-4)', background: 'transparent', border: '1px solid var(--border)', cursor: 'pointer', transition: 'all 0.12s', letterSpacing: '0.04em' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.borderColor = 'var(--border-2)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-4)'; e.currentTarget.style.borderColor = 'var(--border)' }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>
              Refresh
            </button>
          </div>
        }
      />

      {view === 'list' && (
        <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
          {[
            ['all', 'All'],
            ['new', 'New'],
            ['contacted', 'Contacted'],
            ['quoted', 'Quoted'],
            ['won', 'Won'],
            ['lost', 'Lost'],
          ].map(([val, label]) => (
            <Pill key={val} label={label} active={filter === val} onClick={() => setFilter(val)} count={val !== 'all' ? stageCounts[val] || 0 : 0} />
          ))}
          <div style={{ width: 1, height: 24, background: 'var(--border)', alignSelf: 'center', margin: '0 4px' }} />
          {[['sms', 'SMS'], ['voice', 'Voice'], ['chat', 'Chat']].map(([val, label]) => (
            <Pill key={val} label={label} active={filter === val} onClick={() => setFilter(val)} />
          ))}
          <div style={{ width: 1, height: 24, background: 'var(--border)', alignSelf: 'center', margin: '0 4px' }} />
          <Pill label="Hot Leads" active={filter === 'hot'} onClick={() => setFilter('hot')} count={hotCount} />
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}><div className="spinner" /></div>
      ) : view === 'pipeline' ? (
        /* Pipeline / Kanban View */
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${PIPELINE_STAGES.length}, 1fr)`, gap: 10, minHeight: 400 }}>
          {PIPELINE_STAGES.map(stage => {
            const stageLeads = leads.filter(l => (l.pipeline_stage || 'new') === stage.value)
            return (
              <div key={stage.value} style={{
                background: 'var(--black-3)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                display: 'flex', flexDirection: 'column',
                overflow: 'hidden',
              }}>
                {/* Column header */}
                <div style={{
                  padding: '12px 14px',
                  borderBottom: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: stage.color }} />
                    <span style={{ fontSize: 10, fontWeight: 600, color: stage.color, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{stage.label}</span>
                  </div>
                  <span style={{ fontSize: 10, color: 'var(--text-4)', fontFamily: 'var(--font-mono)' }}>{stageLeads.length}</span>
                </div>

                {/* Cards */}
                <div style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 6, flex: 1, overflowY: 'auto' }}>
                  {stageLeads.length === 0 ? (
                    <div style={{ padding: '20px 8px', textAlign: 'center', fontSize: 10, color: 'var(--text-4)' }}>No leads</div>
                  ) : stageLeads.map(l => (
                    <div key={l.id} onClick={() => openDetail(l)} style={{
                      padding: '10px 12px',
                      background: 'var(--black-4)',
                      border: '1px solid var(--border)',
                      borderRadius: 8,
                      cursor: 'pointer',
                      transition: 'border-color 0.12s',
                    }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-2)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                        <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)' }}>{l.full_name || 'Unknown'}</div>
                        <ScoreBar score={l.lead_score} />
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--text-4)', marginBottom: 6 }}>{l.service_type || 'No service specified'}</div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <SourceTag lead={l} />
                        <span style={{ fontSize: 9, color: 'var(--text-4)', fontFamily: 'var(--font-mono)' }}>
                          {l.created_at ? formatDistanceToNow(new Date(l.created_at), { addSuffix: true }) : ''}
                        </span>
                      </div>
                      {l.tags && l.tags.length > 0 && (
                        <div style={{ display: 'flex', gap: 4, marginTop: 6, flexWrap: 'wrap' }}>
                          {l.tags.slice(0, 3).map(t => (
                            <span key={t} style={{ fontSize: 8, padding: '2px 6px', borderRadius: 99, background: 'rgba(232,232,232,0.04)', color: 'var(--text-4)', border: '1px solid var(--border)' }}>{t}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* List View */
        <div style={{ background: 'var(--black-3)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
          {filtered.length === 0
            ? <div style={{ padding: '48px 20px', textAlign: 'center', color: 'var(--text-4)', fontSize: 11, letterSpacing: '0.04em' }}>No leads found</div>
            : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['Name', 'Phone', 'Service', 'Source', 'Score', 'Stage', 'Date', ''].map(h => (
                      <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 9, fontWeight: 600, color: 'var(--text-4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(lead => (
                    <tr key={lead.id}
                      style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer', transition: 'background 0.1s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(232,232,232,0.02)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      onClick={() => openDetail(lead)}
                    >
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)', marginBottom: 2 }}>{lead.full_name || '—'}</div>
                        {lead.tags && lead.tags.length > 0 && (
                          <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                            {lead.tags.slice(0, 2).map(t => (
                              <span key={t} style={{ fontSize: 8, padding: '1px 6px', borderRadius: 99, background: 'rgba(232,232,232,0.04)', color: 'var(--text-4)', border: '1px solid var(--border)' }}>{t}</span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 11, color: 'var(--text-4)', fontFamily: 'var(--font-mono)' }}>{lead.phone?.startsWith('web_') ? 'Web chat' : lead.phone || '—'}</td>
                      <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--text-3)' }}>{lead.service_type || '—'}</td>
                      <td style={{ padding: '12px 16px' }}><SourceTag lead={lead} /></td>
                      <td style={{ padding: '12px 16px' }}><ScoreBar score={lead.lead_score} /></td>
                      <td style={{ padding: '12px 16px' }}><PipelineTag stage={lead.pipeline_stage || 'new'} /></td>
                      <td style={{ padding: '12px 16px', fontSize: 10, color: 'var(--text-4)' }}>{lead.created_at ? formatDistanceToNow(new Date(lead.created_at), { addSuffix: true }) : '—'}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ fontSize: 10, color: 'var(--text-4)', letterSpacing: '0.04em' }}>View →</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          }
        </div>
      )}

      {selected && (
        <CustomerDetail
          lead={selected}
          messages={messages}
          onClose={closeDetail}
          onUpdate={() => { load(); closeDetail() }}
        />
      )}
    </div>
  )
}

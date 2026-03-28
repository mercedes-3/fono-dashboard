import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { formatDistanceToNow } from 'date-fns'

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

function Pill({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: '4px 14px', borderRadius: 99, fontSize: 10, fontWeight: 500,
      letterSpacing: '0.06em', textTransform: 'uppercase',
      background: active ? 'rgba(232,232,232,0.08)' : 'transparent',
      color: active ? 'var(--platinum-2)' : 'var(--text-4)',
      border: `1px solid ${active ? 'rgba(232,232,232,0.16)' : 'var(--border)'}`,
      cursor: 'pointer', transition: 'all 0.12s',
    }}>{label}</button>
  )
}

const STATUS_MAP = {
  schedule_captured: { label: 'Complete', bg: 'var(--green-dim)', color: 'var(--green)', border: 'rgba(74,222,128,0.15)' },
  collecting:        { label: 'Collecting', bg: 'var(--black-5)', color: 'var(--text-4)', border: 'var(--border)' },
  new:               { label: 'New', bg: 'var(--black-5)', color: 'var(--text-4)', border: 'var(--border)' },
}

function StatusPill({ status }) {
  const s = STATUS_MAP[status] || STATUS_MAP.new
  return (
    <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 99, background: s.bg, color: s.color, border: `1px solid ${s.border}`, whiteSpace: 'nowrap' }}>
      {s.label}
    </span>
  )
}

export default function Leads({ tenant }) {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => { if (tenant?.id) load() }, [tenant])

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('leads').select('*').eq('tenant_id', tenant.id).order('created_at', { ascending: false })
    setLeads(data || [])
    setLoading(false)
  }

  const filtered = leads.filter(l => {
    if (filter === 'sms') return !l.phone?.startsWith('web_') && l.source !== 'voice'
    if (filter === 'voice') return l.source === 'voice'
    if (filter === 'chat') return l.phone?.startsWith('web_')
    if (filter === 'complete') return l.intake_status === 'schedule_captured'
    return true
  })

  return (
    <div style={{ padding: 40, maxWidth: 960 }}>
      <PageTitle
        title="Leads"
        sub={`${leads.length} total · ${leads.filter(l => l.intake_status === 'schedule_captured').length} completed`}
        action={
          <button onClick={load} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, fontSize: 11, fontWeight: 500, color: 'var(--text-4)', background: 'transparent', border: '1px solid var(--border)', cursor: 'pointer', transition: 'all 0.12s', letterSpacing: '0.04em' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.borderColor = 'var(--border-2)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-4)'; e.currentTarget.style.borderColor = 'var(--border)' }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>
            Refresh
          </button>
        }
      />

      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {[['all','All'], ['sms','SMS'], ['voice','Voice'], ['chat','Chat'], ['complete','Complete']].map(([val, label]) => (
          <Pill key={val} label={label} active={filter === val} onClick={() => setFilter(val)} />
        ))}
      </div>

      <div style={{ background: 'var(--black-3)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        {loading
          ? <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}><div className="spinner" /></div>
          : filtered.length === 0
            ? <div style={{ padding: '48px 20px', textAlign: 'center', color: 'var(--text-4)', fontSize: 11, letterSpacing: '0.04em' }}>No leads found</div>
            : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['Name', 'Phone', 'Service', 'Source', 'Status', 'Date', ''].map(h => (
                      <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 9, fontWeight: 600, color: 'var(--text-4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(lead => (
                    <>
                      <tr key={lead.id}
                        onClick={() => setSelected(selected?.id === lead.id ? null : lead)}
                        style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer', transition: 'background 0.1s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(232,232,232,0.02)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '12px 16px', fontSize: 12, fontWeight: 500, color: 'var(--text)' }}>{lead.full_name || '—'}</td>
                        <td style={{ padding: '12px 16px', fontSize: 11, color: 'var(--text-4)', fontFamily: 'var(--font-mono)' }}>{lead.phone?.startsWith('web_') ? 'Web chat' : lead.phone || '—'}</td>
                        <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--text-3)' }}>{lead.service_type || '—'}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 99, background: lead.source === 'voice' ? 'var(--blue-dim)' : lead.phone?.startsWith('web_') ? 'var(--green-dim)' : 'var(--black-5)', color: lead.source === 'voice' ? 'var(--blue)' : lead.phone?.startsWith('web_') ? 'var(--green)' : 'var(--text-4)', border: '1px solid var(--border)' }}>
                            {lead.source || 'sms'}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px' }}><StatusPill status={lead.intake_status} /></td>
                        <td style={{ padding: '12px 16px', fontSize: 10, color: 'var(--text-4)' }}>{lead.created_at ? formatDistanceToNow(new Date(lead.created_at), { addSuffix: true }) : '—'}</td>
                        <td style={{ padding: '12px 16px', fontSize: 10, color: 'var(--text-4)', letterSpacing: '0.04em' }}>{selected?.id === lead.id ? 'Close ↑' : 'View →'}</td>
                      </tr>
                      {selected?.id === lead.id && (
                        <tr key={`${lead.id}-detail`} style={{ background: 'rgba(232,232,232,0.02)' }}>
                          <td colSpan={7} style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
                              {[['Name', lead.full_name], ['Phone', lead.phone?.startsWith('web_') ? 'Web chat' : lead.phone], ['Address', lead.service_address], ['Service', lead.service_type], ['Issue', lead.issue_summary], ['Preferred Time', lead.preferred_time_text], ['Status', lead.intake_status], ['Source', lead.source]].map(([label, value]) => (
                                <div key={label}>
                                  <div style={{ fontSize: 9, color: 'var(--text-4)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 5 }}>{label}</div>
                                  <div style={{ fontSize: 12, color: value ? 'var(--text)' : 'var(--text-4)' }}>{value || '—'}</div>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            )
        }
      </div>
    </div>
  )
}

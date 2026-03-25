import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { formatDistanceToNow } from 'date-fns'

export default function Leads({ tenant }) {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (tenant?.id) loadLeads()
  }, [tenant])

  async function loadLeads() {
    setLoading(true)
    const { data } = await supabase
      .from('leads')
      .select('*')
      .eq('tenant_id', tenant.id)
      .order('created_at', { ascending: false })
    setLeads(data || [])
    setLoading(false)
  }

  const filtered = leads.filter(l => {
    if (filter === 'all') return true
    if (filter === 'sms') return !l.phone?.startsWith('web_')
    if (filter === 'chat') return l.phone?.startsWith('web_')
    if (filter === 'complete') return l.intake_status === 'schedule_captured'
    return true
  })

  const statusColor = (s) => {
    if (s === 'schedule_captured') return 'badge-green'
    if (s === 'collecting') return 'badge-blue'
    if (s === 'new') return 'badge-gray'
    return 'badge-gray'
  }

  return (
    <div style={{ padding: 32, maxWidth: 900 }} className="fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em' }}>Leads</h1>
          <p style={{ color: 'var(--text-3)', fontSize: 13, marginTop: 2 }}>{leads.length} total · {leads.filter(l => l.intake_status === 'schedule_captured').length} completed</p>
        </div>
        <button className="btn btn-ghost" onClick={loadLeads}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 18 }}>
        {['all', 'sms', 'chat', 'complete'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '5px 12px',
            borderRadius: 99,
            fontSize: 12,
            fontWeight: 500,
            background: filter === f ? 'var(--accent-dim)' : 'var(--bg-3)',
            color: filter === f ? 'var(--accent-2)' : 'var(--text-3)',
            border: `1px solid ${filter === f ? 'rgba(59,130,246,0.3)' : 'var(--border)'}`,
            cursor: 'pointer',
            transition: 'all 0.12s',
            textTransform: 'capitalize',
          }}>
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
            <p>No leads found</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Name', 'Phone', 'Service', 'Source', 'Status', 'Date'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--text-3)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(lead => (
                <tr
                  key={lead.id}
                  onClick={() => setSelected(selected?.id === lead.id ? null : lead)}
                  style={{
                    borderBottom: '1px solid var(--border)',
                    cursor: 'pointer',
                    background: selected?.id === lead.id ? 'var(--bg-3)' : 'transparent',
                    transition: 'background 0.1s',
                  }}
                >
                  <td style={{ padding: '11px 16px', fontSize: 13, fontWeight: 500 }}>{lead.full_name || '—'}</td>
                  <td style={{ padding: '11px 16px', fontSize: 12, color: 'var(--text-2)', fontFamily: 'var(--font-mono)' }}>
                    {lead.phone?.startsWith('web_') ? 'Web chat' : lead.phone || '—'}
                  </td>
                  <td style={{ padding: '11px 16px', fontSize: 12, color: 'var(--text-2)' }}>{lead.service_type || '—'}</td>
                  <td style={{ padding: '11px 16px' }}>
                    <span className={`badge ${lead.source === 'voice' ? 'badge-blue' : lead.phone?.startsWith('web_') ? 'badge-green' : 'badge-gray'}`}>
                      {lead.source || 'sms'}
                    </span>
                  </td>
                  <td style={{ padding: '11px 16px' }}>
                    <span className={`badge ${statusColor(lead.intake_status)}`}>{lead.intake_status || 'new'}</span>
                  </td>
                  <td style={{ padding: '11px 16px', fontSize: 11, color: 'var(--text-3)' }}>
                    {lead.created_at ? formatDistanceToNow(new Date(lead.created_at), { addSuffix: true }) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Lead detail panel */}
      {selected && (
        <div className="card fade-in" style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>{selected.full_name || 'Lead Detail'}</span>
            <button onClick={() => setSelected(null)} style={{ color: 'var(--text-3)', fontSize: 18 }}>×</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
            {[
              ['Name', selected.full_name],
              ['Phone', selected.phone?.startsWith('web_') ? 'Web chat' : selected.phone],
              ['Address', selected.service_address],
              ['Service', selected.service_type],
              ['Issue', selected.issue_summary],
              ['Preferred Time', selected.preferred_time_text],
              ['Status', selected.intake_status],
              ['Source', selected.source],
            ].map(([label, value]) => (
              <div key={label}>
                <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 3, fontWeight: 500, letterSpacing: '0.03em', textTransform: 'uppercase' }}>{label}</div>
                <div style={{ fontSize: 13, color: value ? 'var(--text)' : 'var(--text-3)' }}>{value || '—'}</div>
              </div>
            ))}
          </div>
          {selected.last_question && (
            <div style={{ marginTop: 14, padding: '10px 13px', background: 'var(--bg-3)', borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 4, fontWeight: 500 }}>LAST MESSAGE SENT</div>
              <div style={{ fontSize: 13, color: 'var(--text-2)' }}>{selected.last_question}</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

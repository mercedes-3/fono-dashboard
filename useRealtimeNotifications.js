import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { formatDistanceToNow } from 'date-fns'
import PageHeader from '../../components/PageHeader'

const STATUS = {
  schedule_captured: 'badge-green',
  collecting: 'badge-blue',
  awaiting_schedule: 'badge-amber',
  new: 'badge-gray',
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
    if (filter === 'sms') return !l.phone?.startsWith('web_')
    if (filter === 'chat') return l.phone?.startsWith('web_')
    if (filter === 'complete') return l.intake_status === 'schedule_captured'
    return true
  })

  return (
    <div style={{ padding: 40, maxWidth: 960 }} className="fade-up">
      <PageHeader
        title="Leads"
        sub={`${leads.length} total · ${leads.filter(l => l.intake_status === 'schedule_captured').length} completed`}
        action={
          <button className="btn btn-ghost" onClick={load}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>
            Refresh
          </button>
        }
      />

      {/* Filters */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
        {['all', 'sms', 'chat', 'complete'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '4px 12px', borderRadius: 99, fontSize: 10, fontWeight: 500,
            letterSpacing: '0.04em', textTransform: 'uppercase',
            background: filter === f ? 'var(--accent-dim)' : 'transparent',
            color: filter === f ? 'var(--platinum-2)' : 'var(--text-4)',
            border: `1px solid ${filter === f ? 'var(--border-3)' : 'var(--border)'}`,
            cursor: 'pointer', transition: 'all 0.12s',
          }}>{f}</button>
        ))}
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}><div className="spinner" /></div>
        : filtered.length === 0 ? <div className="empty"><p>No leads found</p></div>
        : (
          <table className="table">
            <thead>
              <tr>
                {['Name', 'Contact', 'Service', 'Source', 'Status', 'Date', ''].map(h => <th key={h}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {filtered.map(lead => (
                <tr key={lead.id} onClick={() => setSelected(selected?.id === lead.id ? null : lead)} style={{ cursor: 'pointer' }}>
                  <td style={{ color: 'var(--text)', fontWeight: 500 }}>{lead.full_name || '—'}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>{lead.phone?.startsWith('web_') ? 'Web chat' : lead.phone || '—'}</td>
                  <td>{lead.service_type || '—'}</td>
                  <td><span className={`badge ${lead.source === 'voice' ? 'badge-blue' : lead.phone?.startsWith('web_') ? 'badge-green' : 'badge-plat'}`}>{lead.source || 'sms'}</span></td>
                  <td><span className={`badge ${STATUS[lead.intake_status] || 'badge-gray'}`}>{lead.intake_status || 'new'}</span></td>
                  <td style={{ fontSize: 10, color: 'var(--text-4)' }}>{lead.created_at ? formatDistanceToNow(new Date(lead.created_at), { addSuffix: true }) : '—'}</td>
                  <td><span style={{ fontSize: 10, color: 'var(--text-4)' }}>View →</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selected && (
        <div className="card fade-up" style={{ marginTop: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 400, color: 'var(--text)' }}>{selected.full_name || 'Lead Detail'}</span>
            <button onClick={() => setSelected(null)} style={{ color: 'var(--text-4)', fontSize: 16 }}>×</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            {[['Name', selected.full_name], ['Phone', selected.phone?.startsWith('web_') ? 'Web chat' : selected.phone], ['Address', selected.service_address], ['Service', selected.service_type], ['Issue', selected.issue_summary], ['Preferred Time', selected.preferred_time_text], ['Status', selected.intake_status], ['Source', selected.source]].map(([label, value]) => (
              <div key={label}>
                <div style={{ fontSize: 9, color: 'var(--text-4)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 12, color: value ? 'var(--text)' : 'var(--text-4)' }}>{value || '—'}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

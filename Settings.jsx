import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { formatDistanceToNow } from 'date-fns'
import PageHeader from '../../components/PageHeader'

export default function Calls({ tenant }) {
  const [calls, setCalls] = useState([])
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('calls')

  useEffect(() => { if (tenant?.id) load() }, [tenant])

  async function load() {
    setLoading(true)
    const [c, m] = await Promise.all([
      supabase.from('call_logs').select('*').eq('tenant_id', tenant.id).order('created_at', { ascending: false }).limit(50),
      supabase.from('messages').select('*').eq('tenant_id', tenant.id).order('created_at', { ascending: false }).limit(100),
    ])
    setCalls(c.data || [])
    setMessages(m.data || [])
    setLoading(false)
  }

  const STATUS = { completed: 'badge-green', 'in-progress': 'badge-blue', failed: 'badge-red', 'no-answer': 'badge-red' }

  return (
    <div style={{ padding: 40, maxWidth: 960 }} className="fade-up">
      <PageHeader
        title="Calls & Messages"
        sub={`${calls.length} calls · ${messages.filter(m => m.direction === 'inbound').length} inbound messages`}
        action={<button className="btn btn-ghost" onClick={load}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>Refresh</button>}
      />

      <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
        {[['calls', `Calls (${calls.length})`], ['messages', `SMS (${messages.filter(m => m.direction === 'inbound').length})`]].map(([t, label]) => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '4px 12px', borderRadius: 99, fontSize: 10, fontWeight: 500,
            letterSpacing: '0.04em', textTransform: 'uppercase',
            background: tab === t ? 'var(--accent-dim)' : 'transparent',
            color: tab === t ? 'var(--platinum-2)' : 'var(--text-4)',
            border: `1px solid ${tab === t ? 'var(--border-3)' : 'var(--border)'}`,
            cursor: 'pointer', transition: 'all 0.12s',
          }}>{label}</button>
        ))}
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}><div className="spinner" /></div>
        : tab === 'calls' ? (
          calls.length === 0 ? <div className="empty"><p>No calls yet</p></div> : (
            <table className="table">
              <thead><tr>{['From', 'Direction', 'Status', 'Duration', 'Date'].map(h => <th key={h}>{h}</th>)}</tr></thead>
              <tbody>
                {calls.map(c => (
                  <tr key={c.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text)' }}>{c.from_number || '—'}</td>
                    <td><span className={`badge ${c.direction === 'inbound' ? 'badge-blue' : 'badge-plat'}`}>{c.direction}</span></td>
                    <td><span className={`badge ${STATUS[c.status] || 'badge-gray'}`}>{c.status || '—'}</span></td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>{c.duration_secs ? `${c.duration_secs}s` : '—'}</td>
                    <td style={{ fontSize: 10, color: 'var(--text-4)' }}>{c.created_at ? formatDistanceToNow(new Date(c.created_at), { addSuffix: true }) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        ) : (
          messages.length === 0 ? <div className="empty"><p>No messages yet</p></div> : (
            <table className="table">
              <thead><tr>{['From', 'To', 'Direction', 'Message', 'Date'].map(h => <th key={h}>{h}</th>)}</tr></thead>
              <tbody>
                {messages.map(m => (
                  <tr key={m.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 10 }}>{m.from_number?.startsWith('web_') ? 'Web' : m.from_number || '—'}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 10 }}>{m.to_number?.startsWith('web_') ? 'Web' : m.to_number || '—'}</td>
                    <td><span className={`badge ${m.direction === 'inbound' ? 'badge-blue' : 'badge-green'}`}>{m.direction}</span></td>
                    <td style={{ maxWidth: 260 }}><div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: 11 }}>{m.body || '—'}</div></td>
                    <td style={{ fontSize: 10, color: 'var(--text-4)' }}>{m.created_at ? formatDistanceToNow(new Date(m.created_at), { addSuffix: true }) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        )}
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { formatDistanceToNow } from 'date-fns'

export default function Calls({ tenant }) {
  const [calls, setCalls] = useState([])
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('calls')

  useEffect(() => {
    if (tenant?.id) loadData()
  }, [tenant])

  async function loadData() {
    setLoading(true)
    const [c, m] = await Promise.all([
      supabase.from('call_logs').select('*').eq('tenant_id', tenant.id).order('created_at', { ascending: false }).limit(50),
      supabase.from('messages').select('*').eq('tenant_id', tenant.id).order('created_at', { ascending: false }).limit(100),
    ])
    setCalls(c.data || [])
    setMessages(m.data || [])
    setLoading(false)
  }

  const statusColor = (s) => {
    if (s === 'completed') return 'badge-green'
    if (s === 'in-progress') return 'badge-blue'
    if (s === 'failed' || s === 'no-answer') return 'badge-red'
    return 'badge-gray'
  }

  return (
    <div style={{ padding: 32, maxWidth: 900 }} className="fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em' }}>Calls & Messages</h1>
          <p style={{ color: 'var(--text-3)', fontSize: 13, marginTop: 2 }}>{calls.length} calls · {messages.length} messages</p>
        </div>
        <button className="btn btn-ghost" onClick={loadData}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>
          Refresh
        </button>
      </div>

      {/* Sub tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 18 }}>
        {['calls', 'messages'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '5px 14px',
            borderRadius: 99,
            fontSize: 12,
            fontWeight: 500,
            background: tab === t ? 'var(--accent-dim)' : 'var(--bg-3)',
            color: tab === t ? 'var(--accent-2)' : 'var(--text-3)',
            border: `1px solid ${tab === t ? 'rgba(59,130,246,0.3)' : 'var(--border)'}`,
            cursor: 'pointer',
            transition: 'all 0.12s',
            textTransform: 'capitalize',
          }}>
            {t === 'calls' ? `📞 Calls (${calls.length})` : `💬 SMS (${messages.filter(m => m.direction === 'inbound').length})`}
          </button>
        ))}
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}><div className="spinner" /></div>
        ) : tab === 'calls' ? (
          calls.length === 0 ? (
            <div className="empty-state">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81"/></svg>
              <p>No calls yet</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['From', 'Direction', 'Status', 'Duration', 'Date'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--text-3)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {calls.map(call => (
                  <tr key={call.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '11px 16px', fontSize: 13, fontFamily: 'var(--font-mono)' }}>{call.from_number || '—'}</td>
                    <td style={{ padding: '11px 16px' }}>
                      <span className={`badge ${call.direction === 'inbound' ? 'badge-blue' : 'badge-gray'}`}>{call.direction}</span>
                    </td>
                    <td style={{ padding: '11px 16px' }}>
                      <span className={`badge ${statusColor(call.status)}`}>{call.status || '—'}</span>
                    </td>
                    <td style={{ padding: '11px 16px', fontSize: 12, color: 'var(--text-2)' }}>
                      {call.duration_secs ? `${call.duration_secs}s` : '—'}
                    </td>
                    <td style={{ padding: '11px 16px', fontSize: 11, color: 'var(--text-3)' }}>
                      {call.created_at ? formatDistanceToNow(new Date(call.created_at), { addSuffix: true }) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        ) : (
          messages.length === 0 ? (
            <div className="empty-state">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
              <p>No messages yet</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['From', 'To', 'Direction', 'Message', 'Date'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--text-3)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {messages.map(msg => (
                  <tr key={msg.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '11px 16px', fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-2)' }}>{msg.from_number?.startsWith('web_') ? 'Web' : msg.from_number || '—'}</td>
                    <td style={{ padding: '11px 16px', fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-2)' }}>{msg.to_number?.startsWith('web_') ? 'Web' : msg.to_number || '—'}</td>
                    <td style={{ padding: '11px 16px' }}>
                      <span className={`badge ${msg.direction === 'inbound' ? 'badge-blue' : 'badge-green'}`}>{msg.direction}</span>
                    </td>
                    <td style={{ padding: '11px 16px', fontSize: 12, color: 'var(--text-2)', maxWidth: 280 }}>
                      <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{msg.body || '—'}</div>
                    </td>
                    <td style={{ padding: '11px 16px', fontSize: 11, color: 'var(--text-3)' }}>
                      {msg.created_at ? formatDistanceToNow(new Date(msg.created_at), { addSuffix: true }) : '—'}
                    </td>
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

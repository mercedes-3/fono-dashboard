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

function Tag({ label, type }) {
  const styles = {
    inbound:     { bg: 'var(--blue-dim)',  color: 'var(--blue)',  border: 'rgba(96,165,250,0.15)' },
    outbound:    { bg: 'var(--black-5)',   color: 'var(--text-4)', border: 'var(--border)' },
    completed:   { bg: 'var(--green-dim)', color: 'var(--green)', border: 'rgba(74,222,128,0.15)' },
    'in-progress': { bg: 'var(--blue-dim)', color: 'var(--blue)', border: 'rgba(96,165,250,0.15)' },
    failed:      { bg: 'var(--red-dim)',   color: 'var(--red)',   border: 'rgba(248,113,113,0.15)' },
    'no-answer': { bg: 'var(--red-dim)',   color: 'var(--red)',   border: 'rgba(248,113,113,0.15)' },
  }
  const s = styles[type] || { bg: 'var(--black-5)', color: 'var(--text-4)', border: 'var(--border)' }
  return (
    <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 99, background: s.bg, color: s.color, border: `1px solid ${s.border}`, whiteSpace: 'nowrap' }}>
      {label}
    </span>
  )
}

function TranscriptPanel({ transcript, recording_url }) {
  if (!transcript && !recording_url) {
    return (
      <div style={{ padding: '16px 20px', fontSize: 11, color: 'var(--text-4)', fontStyle: 'italic' }}>
        No transcript available for this call.
      </div>
    )
  }

  return (
    <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)', background: 'rgba(232,232,232,0.015)' }}>
      {recording_url && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--text-4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Recording</div>
          <audio controls src={recording_url} style={{ width: '100%', height: 32, borderRadius: 6 }} />
        </div>
      )}
      {transcript && (
        <div>
          <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--text-4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Transcript</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {transcript.split('\n').filter(line => line.trim()).map((line, i) => {
              const isCaller = line.startsWith('[Caller]')
              const isAI = line.startsWith('[AI')
              const cleanLine = line.replace(/^\[Caller\]:\s*/, '').replace(/^\[AI[^\]]*\]:\s*/, '')
              return (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{
                    fontSize: 8, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
                    padding: '2px 6px', borderRadius: 4, flexShrink: 0, marginTop: 2,
                    background: isCaller ? 'var(--blue-dim)' : 'var(--green-dim)',
                    color: isCaller ? 'var(--blue)' : 'var(--green)',
                    border: `1px solid ${isCaller ? 'rgba(96,165,250,0.15)' : 'rgba(74,222,128,0.15)'}`,
                  }}>
                    {isCaller ? 'Caller' : isAI ? 'AI' : 'System'}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.6 }}>{cleanLine}</div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default function Calls({ tenant }) {
  const [calls, setCalls] = useState([])
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('calls')
  const [expandedCall, setExpandedCall] = useState(null)

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

  const inbound = messages.filter(m => m.direction === 'inbound')

  return (
    <div style={{ padding: 40, maxWidth: 960 }}>
      <PageTitle
        title="Calls & Messages"
        sub={`${calls.length} calls · ${inbound.length} inbound messages`}
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
        <Pill label={`Calls (${calls.length})`} active={tab === 'calls'} onClick={() => setTab('calls')} />
        <Pill label={`SMS (${inbound.length})`} active={tab === 'messages'} onClick={() => setTab('messages')} />
      </div>

      <div style={{ background: 'var(--black-3)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        {loading
          ? <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}><div className="spinner" /></div>
          : tab === 'calls'
            ? calls.length === 0
              ? <div style={{ padding: '48px 20px', textAlign: 'center', color: 'var(--text-4)', fontSize: 11, letterSpacing: '0.04em' }}>No calls yet</div>
              : (
                <div>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border)' }}>
                        {['', 'From', 'Direction', 'Status', 'Duration', 'Date'].map(h => (
                          <th key={h || 'expand'} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 9, fontWeight: 600, color: 'var(--text-4)', letterSpacing: '0.1em', textTransform: 'uppercase', width: h === '' ? 32 : 'auto' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {calls.map(c => {
                        const isExpanded = expandedCall === c.id
                        const hasTranscript = !!(c.transcript || c.recording_url)
                        return (
                          <tr key={c.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.1s', cursor: hasTranscript ? 'pointer' : 'default' }}
                            onClick={() => hasTranscript && setExpandedCall(isExpanded ? null : c.id)}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(232,232,232,0.02)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                            <td style={{ padding: '12px 8px 12px 16px', width: 32 }}>
                              {hasTranscript && (
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--text-4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.15s' }}>
                                  <polyline points="9 18 15 12 9 6"/>
                                </svg>
                              )}
                            </td>
                            <td style={{ padding: '12px 16px', fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>{c.from_number || '—'}</td>
                            <td style={{ padding: '12px 16px' }}><Tag label={c.direction} type={c.direction} /></td>
                            <td style={{ padding: '12px 16px' }}><Tag label={c.status || '—'} type={c.status} /></td>
                            <td style={{ padding: '12px 16px', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-4)' }}>{c.duration_secs ? `${c.duration_secs}s` : '—'}</td>
                            <td style={{ padding: '12px 16px', fontSize: 10, color: 'var(--text-4)' }}>{c.created_at ? formatDistanceToNow(new Date(c.created_at), { addSuffix: true }) : '—'}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                  {expandedCall && calls.find(c => c.id === expandedCall) && (
                    <TranscriptPanel
                      transcript={calls.find(c => c.id === expandedCall).transcript}
                      recording_url={calls.find(c => c.id === expandedCall).recording_url}
                    />
                  )}
                </div>
              )
            : messages.length === 0
              ? <div style={{ padding: '48px 20px', textAlign: 'center', color: 'var(--text-4)', fontSize: 11, letterSpacing: '0.04em' }}>No messages yet</div>
              : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      {['From', 'Direction', 'Message', 'Date'].map(h => (
                        <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 9, fontWeight: 600, color: 'var(--text-4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {messages.map(m => (
                      <tr key={m.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.1s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(232,232,232,0.02)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <td style={{ padding: '12px 16px', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>{m.from_number?.startsWith('web_') ? 'Web' : m.from_number || '—'}</td>
                        <td style={{ padding: '12px 16px' }}><Tag label={m.direction} type={m.direction} /></td>
                        <td style={{ padding: '12px 16px', maxWidth: 320 }}>
                          <div style={{ fontSize: 12, color: 'var(--text-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.body || '—'}</div>
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: 10, color: 'var(--text-4)' }}>{m.created_at ? formatDistanceToNow(new Date(m.created_at), { addSuffix: true }) : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
        }
      </div>
    </div>
  )
}

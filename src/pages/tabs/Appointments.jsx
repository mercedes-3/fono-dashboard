import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { formatDistanceToNow, format } from 'date-fns'

const STATUS_COLORS = {
  pending: 'badge-yellow',
  confirmed: 'badge-green',
  declined: 'badge-red',
  completed: 'badge-blue',
  cancelled: 'badge-gray',
}

function ConfirmModal({ appt, onClose, onAction }) {
  const [loading, setLoading] = useState(false)

  const handle = async (action) => {
    setLoading(true)
    await onAction(appt.id, action)
    setLoading(false)
    onClose()
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 999,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }} onClick={onClose}>
      <div className="card fade-in" style={{ width: '100%', maxWidth: 440 }} onClick={e => e.stopPropagation()}>
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Appointment Request</h3>
          <p style={{ fontSize: 12, color: 'var(--text-3)' }}>Review and respond to this request</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {[
            ['Customer', appt.customer_name],
            ['Phone', appt.customer_phone?.startsWith('web_') ? 'Web chat' : appt.customer_phone],
            ['Service', appt.service_type],
            ['Address', appt.service_address],
            ['Preferred Time', appt.preferred_time_text],
            ['Issue', appt.issue_summary],
          ].map(([label, value]) => (
            <div key={label} style={{ display: 'flex', gap: 12 }}>
              <span style={{ fontSize: 12, color: 'var(--text-3)', width: 100, flexShrink: 0, fontWeight: 500 }}>{label}</span>
              <span style={{ fontSize: 13, color: value ? 'var(--text)' : 'var(--text-3)' }}>{value || '—'}</span>
            </div>
          ))}
        </div>

        <div style={{ padding: '12px', background: 'var(--bg-3)', borderRadius: 8, marginBottom: 20 }}>
          <p style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 4, fontWeight: 500 }}>REQUESTED</p>
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--accent-2)' }}>{appt.preferred_time_text || 'No time specified'}</p>
        </div>

        {appt.status === 'pending' ? (
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              className="btn btn-danger"
              style={{ flex: 1 }}
              onClick={() => handle('declined')}
              disabled={loading}
            >
              {loading ? <span className="spinner" /> : '✕'} Decline
            </button>
            <button
              className="btn btn-primary"
              style={{ flex: 1, background: 'var(--green)', }}
              onClick={() => handle('confirmed')}
              disabled={loading}
            >
              {loading ? <span className="spinner" /> : '✓'} Confirm
            </button>
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <span className={`badge ${STATUS_COLORS[appt.status]}`} style={{ fontSize: 13, padding: '6px 16px' }}>
              {appt.status}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Appointments({ tenant }) {
  const [appts, setAppts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('all')
  const [actionMsg, setActionMsg] = useState('')

  useEffect(() => {
    if (tenant?.id) loadAppts()
  }, [tenant])

  async function loadAppts() {
    setLoading(true)
    const { data, error } = await supabase
      .from('appointment_requests')
      .select('*')
      .eq('tenant_id', tenant.id)
      .order('created_at', { ascending: false })
    setAppts(data || [])
    setLoading(false)
  }

  async function handleAction(apptId, newStatus) {
    const { error } = await supabase
      .from('appointment_requests')
      .update({ status: newStatus })
      .eq('id', apptId)

    if (error) {
      setActionMsg(`❌ Failed: ${error.message}`)
    } else {
      setActionMsg(`✅ Appointment ${newStatus}!`)
      setTimeout(() => setActionMsg(''), 3000)
      loadAppts()
    }
  }

  const filtered = appts.filter(a => {
    if (filter === 'all') return true
    return a.status === filter
  })

  const pendingCount = appts.filter(a => a.status === 'pending').length

  return (
    <div style={{ padding: 32, maxWidth: 900 }} className="fade-in">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em' }}>Appointments</h1>
          <p style={{ color: 'var(--text-3)', fontSize: 13, marginTop: 2 }}>
            {appts.length} total
            {pendingCount > 0 && <span style={{ color: 'var(--yellow)', fontWeight: 600 }}> · {pendingCount} pending</span>}
          </p>
        </div>
        <button className="btn btn-ghost" onClick={loadAppts}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>
          Refresh
        </button>
      </div>

      {/* Action message */}
      {actionMsg && (
        <div style={{
          padding: '10px 14px',
          borderRadius: 8,
          marginBottom: 16,
          fontSize: 13,
          background: actionMsg.startsWith('✅') ? 'var(--green-dim)' : 'var(--red-dim)',
          color: actionMsg.startsWith('✅') ? 'var(--green)' : 'var(--red)',
          border: `1px solid ${actionMsg.startsWith('✅') ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
        }}>
          {actionMsg}
        </div>
      )}

      {/* Pending banner */}
      {pendingCount > 0 && (
        <div style={{
          background: 'var(--yellow-dim)',
          border: '1px solid rgba(245,158,11,0.25)',
          borderRadius: 10,
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 20,
          fontSize: 13,
          color: 'var(--yellow)',
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
          <span><strong>{pendingCount} appointment{pendingCount > 1 ? 's' : ''}</strong> waiting for your response — click to confirm or decline</span>
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 18 }}>
        {['all', 'pending', 'confirmed', 'declined', 'completed'].map(f => (
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
            {f}{f === 'pending' && pendingCount > 0 ? ` (${pendingCount})` : ''}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
            <div className="spinner" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <p>No {filter === 'all' ? '' : filter} appointments</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Customer', 'Service', 'Requested Time', 'Source', 'Status', 'Date', ''].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--text-3)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(appt => (
                <tr key={appt.id} style={{
                  borderBottom: '1px solid var(--border)',
                  transition: 'background 0.1s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-3)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{appt.customer_name || '—'}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
                      {appt.customer_phone?.startsWith('web_') ? 'Web chat' : appt.customer_phone || '—'}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-2)' }}>{appt.service_type || '—'}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-2)' }}>{appt.preferred_time_text || '—'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className={`badge ${appt.customer_phone?.startsWith('web_') ? 'badge-green' : 'badge-blue'}`}>
                      {appt.customer_phone?.startsWith('web_') ? 'chat' : 'sms/voice'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className={`badge ${STATUS_COLORS[appt.status] || 'badge-gray'}`}>
                      {appt.status || 'pending'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 11, color: 'var(--text-3)' }}>
                    {appt.created_at ? formatDistanceToNow(new Date(appt.created_at), { addSuffix: true }) : '—'}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <button
                      className="btn btn-ghost"
                      style={{ padding: '5px 12px', fontSize: 12 }}
                      onClick={() => setSelected(appt)}
                    >
                      {appt.status === 'pending' ? 'Review →' : 'View →'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {selected && (
        <ConfirmModal
          appt={selected}
          onClose={() => setSelected(null)}
          onAction={handleAction}
        />
      )}
    </div>
  )
}

import { useState, useEffect, useMemo } from 'react'
import { supabase } from '../../lib/supabase'
import { formatDistanceToNow, startOfWeek, addDays, format, isSameDay, addWeeks, subWeeks } from 'date-fns'

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

const STATUS_STYLES = {
  pending:   { bg: 'var(--amber-dim)', color: 'var(--amber)', border: 'rgba(251,191,36,0.15)' },
  confirmed: { bg: 'var(--green-dim)', color: 'var(--green)', border: 'rgba(74,222,128,0.15)' },
  declined:  { bg: 'var(--red-dim)',   color: 'var(--red)',   border: 'rgba(248,113,113,0.15)' },
  completed: { bg: 'rgba(232,232,232,0.06)', color: 'var(--platinum-3)', border: 'rgba(232,232,232,0.1)' },
  cancelled: { bg: 'var(--black-5)',   color: 'var(--text-4)', border: 'var(--border)' },
}

function StatusTag({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.pending
  return (
    <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 99, background: s.bg, color: s.color, border: `1px solid ${s.border}`, whiteSpace: 'nowrap' }}>
      {status || 'pending'}
    </span>
  )
}

function StatusDot({ status }) {
  const colors = {
    pending: 'var(--amber)',
    confirmed: 'var(--green)',
    declined: 'var(--red)',
    completed: 'var(--platinum-3)',
    cancelled: 'var(--text-4)',
  }
  return <div style={{ width: 6, height: 6, borderRadius: '50%', background: colors[status] || colors.pending, flexShrink: 0 }} />
}

function Modal({ appt, onClose, onAction }) {
  const [loading, setLoading] = useState(false)

  const handle = async (status) => {
    setLoading(true)
    await onAction(appt.id, status)
    setLoading(false)
    onClose()
  }

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 420, background: 'var(--black-3)', border: '1px solid var(--border-2)', borderRadius: 14, padding: 28 }}>
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 10, color: 'var(--text-4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Appointment Request</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 300, color: 'var(--text)' }}>{appt.customer_name || 'Unknown Customer'}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
          {[['Phone', appt.customer_phone?.startsWith('web_') ? 'Web chat' : appt.customer_phone], ['Service', appt.service_type], ['Address', appt.service_address], ['Issue', appt.issue_summary]].map(([label, value]) => (
            <div key={label} style={{ display: 'flex', gap: 14 }}>
              <span style={{ fontSize: 9, color: 'var(--text-4)', width: 72, flexShrink: 0, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', paddingTop: 1 }}>{label}</span>
              <span style={{ fontSize: 12, color: value ? 'var(--text)' : 'var(--text-4)', lineHeight: 1.5 }}>{value || '—'}</span>
            </div>
          ))}
        </div>

        <div style={{ padding: '14px 16px', background: 'var(--black-4)', borderRadius: 8, marginBottom: 22, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 9, color: 'var(--text-4)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Requested Time</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 300, color: 'var(--platinum)' }}>{appt.preferred_time_text || 'Not specified'}</div>
        </div>

        {appt.status === 'pending'
          ? (
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => handle('declined')} disabled={loading} style={{ flex: 1, padding: '9px', borderRadius: 8, fontSize: 11, fontWeight: 500, background: 'var(--red-dim)', color: 'var(--red)', border: '1px solid rgba(248,113,113,0.15)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                {loading ? <span className="spinner" /> : null} Decline
              </button>
              <button onClick={() => handle('confirmed')} disabled={loading} style={{ flex: 1, padding: '9px', borderRadius: 8, fontSize: 11, fontWeight: 500, background: 'var(--green-dim)', color: 'var(--green)', border: '1px solid rgba(74,222,128,0.15)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                {loading ? <span className="spinner" /> : null} Confirm
              </button>
            </div>
          )
          : <div style={{ textAlign: 'center' }}><StatusTag status={appt.status} /></div>
        }
      </div>
    </div>
  )
}

// ─── Calendar View ────────────────────────────────────────────────────────────

function CalendarView({ appts, weekStart, onSelectAppt }) {
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
  const today = new Date()

  const timeSlots = ['7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM']

  // Try to parse appointment times and place them on the calendar
  function getApptsForDay(day) {
    return appts.filter(a => {
      if (!a.created_at) return false
      const created = new Date(a.created_at)
      return isSameDay(created, day)
    })
  }

  return (
    <div style={{ background: 'var(--black-3)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
      {/* Day headers */}
      <div style={{ display: 'grid', gridTemplateColumns: '60px repeat(7, 1fr)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ padding: '12px 8px' }} />
        {days.map(day => {
          const isToday = isSameDay(day, today)
          return (
            <div key={day.toISOString()} style={{
              padding: '12px 8px',
              textAlign: 'center',
              borderLeft: '1px solid var(--border)',
              background: isToday ? 'rgba(232,232,232,0.03)' : 'transparent',
            }}>
              <div style={{ fontSize: 9, color: 'var(--text-4)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>
                {format(day, 'EEE')}
              </div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 20,
                fontWeight: 300,
                color: isToday ? 'var(--platinum)' : 'var(--text-3)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: isToday ? 'rgba(232,232,232,0.08)' : 'transparent',
              }}>
                {format(day, 'd')}
              </div>
            </div>
          )
        })}
      </div>

      {/* Time grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '60px repeat(7, 1fr)', minHeight: 500 }}>
        {/* Time labels */}
        <div>
          {timeSlots.map(time => (
            <div key={time} style={{
              height: 48,
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'flex-end',
              paddingRight: 8,
              paddingTop: 2,
              fontSize: 9,
              color: 'var(--text-4)',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.04em',
              borderBottom: '1px solid var(--border)',
            }}>
              {time}
            </div>
          ))}
        </div>

        {/* Day columns */}
        {days.map(day => {
          const dayAppts = getApptsForDay(day)
          const isToday = isSameDay(day, today)

          return (
            <div key={day.toISOString()} style={{
              borderLeft: '1px solid var(--border)',
              position: 'relative',
              background: isToday ? 'rgba(232,232,232,0.015)' : 'transparent',
            }}>
              {timeSlots.map(time => (
                <div key={time} style={{ height: 48, borderBottom: '1px solid var(--border)' }} />
              ))}

              {/* Appointments overlaid */}
              {dayAppts.map((a, i) => {
                const s = STATUS_STYLES[a.status] || STATUS_STYLES.pending
                return (
                  <div
                    key={a.id}
                    onClick={() => onSelectAppt(a)}
                    style={{
                      position: 'absolute',
                      top: 48 * (i % timeSlots.length) + 4,
                      left: 4,
                      right: 4,
                      padding: '6px 8px',
                      background: s.bg,
                      border: `1px solid ${s.border}`,
                      borderRadius: 6,
                      cursor: 'pointer',
                      transition: 'transform 0.1s',
                      zIndex: 2,
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2 }}>
                      <StatusDot status={a.status} />
                      <span style={{ fontSize: 10, fontWeight: 600, color: s.color, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {a.customer_name || 'Unknown'}
                      </span>
                    </div>
                    <div style={{ fontSize: 9, color: 'var(--text-4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {a.service_type || 'Service'} · {a.preferred_time_text || 'TBD'}
                    </div>
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Appointments({ tenant }) {
  const [appts, setAppts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('all')
  const [view, setView] = useState('list')
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 0 }))
  const [msg, setMsg] = useState('')

  useEffect(() => { if (tenant?.id) load() }, [tenant])

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('appointment_requests').select('*').eq('tenant_id', tenant.id).order('created_at', { ascending: false })
    setAppts(data || [])
    setLoading(false)
  }

 async function handleAction(id, status) {
    const { error } = await supabase.from('appointment_requests').update({ status }).eq('id', id)
    if (error) { setMsg(`❌ ${error.message}`); return }

    // Sync to Google Calendar if confirmed
    if (status === 'confirmed') {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        await fetch('https://nosnibbbggmlzavfylcd.supabase.co/functions/v1/sync-calendar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
          body: JSON.stringify({ tenant_id: tenant.id, appointment_id: id }),
        })
      } catch (e) { console.error('Calendar sync failed:', e) }
    }

    // Notify customer via SMS
    const appt = appts.find(a => a.id === id)
    if (appt?.customer_phone && !appt.customer_phone.startsWith('web_') && tenant.twilio_number) {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        const customerMsg = status === 'confirmed'
          ? `Your appointment is confirmed for ${appt.preferred_time_text}. We look forward to helping you!`
          : `We are unavailable for ${appt.preferred_time_text}. Please reply with another day/time that works.`

        await supabase.from('messages').insert({
          tenant_id: tenant.id,
          lead_id: appt.lead_id,
          from_number: tenant.twilio_number,
          to_number: appt.customer_phone,
          direction: 'outbound',
          body: customerMsg,
          status: 'queued',
        })
      } catch (e) { console.error('Customer notification failed:', e) }
    }

    setMsg(`✅ Appointment ${status}${status === 'confirmed' ? ' · synced to calendar · customer notified' : ' · customer notified'}`)
    setTimeout(() => setMsg(''), 4000)
    load()
  }

  const filtered = appts.filter(a => filter === 'all' ? true : a.status === filter)
  const pending = appts.filter(a => a.status === 'pending').length

  const weekLabel = `${format(weekStart, 'MMM d')} — ${format(addDays(weekStart, 6), 'MMM d, yyyy')}`

  return (
    <div style={{ padding: 40, maxWidth: 1100 }}>
      <PageTitle
        title="Appointments"
        sub={`${appts.length} total${pending > 0 ? ` · ${pending} pending` : ''}`}
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
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 4, verticalAlign: -1 }}>
                  <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
                  <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
                </svg>
                List
              </button>
              <button onClick={() => setView('calendar')} style={{
                padding: '5px 12px', borderRadius: 6, fontSize: 10, fontWeight: 500,
                background: view === 'calendar' ? 'var(--black-5)' : 'transparent',
                color: view === 'calendar' ? 'var(--text)' : 'var(--text-4)',
                border: view === 'calendar' ? '1px solid var(--border-2)' : '1px solid transparent',
                cursor: 'pointer', letterSpacing: '0.04em',
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 4, verticalAlign: -1 }}>
                  <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                Calendar
              </button>
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

      {msg && (
        <div style={{ padding: '10px 16px', borderRadius: 8, marginBottom: 16, fontSize: 12, background: msg.startsWith('✅') ? 'var(--green-dim)' : 'var(--red-dim)', color: msg.startsWith('✅') ? 'var(--green)' : 'var(--red)', border: `1px solid ${msg.startsWith('✅') ? 'rgba(74,222,128,0.15)' : 'rgba(248,113,113,0.15)'}` }}>
          {msg}
        </div>
      )}

      {pending > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', background: 'var(--amber-dim)', border: '1px solid rgba(251,191,36,0.15)', borderRadius: 8, marginBottom: 16, fontSize: 11, color: 'var(--amber)', letterSpacing: '0.02em' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
          <span><strong>{pending} appointment{pending > 1 ? 's' : ''}</strong> awaiting your response — click to confirm or decline</span>
        </div>
      )}

      {/* Calendar navigation — only show in calendar view */}
      {view === 'calendar' && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <button onClick={() => setWeekStart(subWeeks(weekStart, 1))} style={{
            padding: '6px 14px', borderRadius: 8, fontSize: 11, fontWeight: 500,
            color: 'var(--text-4)', background: 'transparent', border: '1px solid var(--border)',
            cursor: 'pointer', letterSpacing: '0.04em',
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            {' '}Prev
          </button>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 300, color: 'var(--text)', letterSpacing: '0.02em' }}>
            {weekLabel}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setWeekStart(startOfWeek(new Date(), { weekStartsOn: 0 }))} style={{
              padding: '6px 14px', borderRadius: 8, fontSize: 11, fontWeight: 500,
              color: 'var(--text-4)', background: 'transparent', border: '1px solid var(--border)',
              cursor: 'pointer', letterSpacing: '0.04em',
            }}>
              Today
            </button>
            <button onClick={() => setWeekStart(addWeeks(weekStart, 1))} style={{
              padding: '6px 14px', borderRadius: 8, fontSize: 11, fontWeight: 500,
              color: 'var(--text-4)', background: 'transparent', border: '1px solid var(--border)',
              cursor: 'pointer', letterSpacing: '0.04em',
            }}>
              Next{' '}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        </div>
      )}

      {/* Filter pills — only show in list view */}
      {view === 'list' && (
        <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
          {['all', 'pending', 'confirmed', 'declined', 'completed'].map(f => (
            <Pill key={f} label={f === 'pending' && pending > 0 ? `Pending (${pending})` : f} active={filter === f} onClick={() => setFilter(f)} />
          ))}
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}><div className="spinner" /></div>
      ) : view === 'calendar' ? (
        <CalendarView appts={appts} weekStart={weekStart} onSelectAppt={setSelected} />
      ) : (
        /* List view */
        <div style={{ background: 'var(--black-3)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
          {filtered.length === 0
            ? <div style={{ padding: '48px 20px', textAlign: 'center', color: 'var(--text-4)', fontSize: 11, letterSpacing: '0.04em' }}>No {filter === 'all' ? '' : filter} appointments</div>
            : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['Customer', 'Service', 'Requested Time', 'Source', 'Status', 'Date', ''].map(h => (
                      <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 9, fontWeight: 600, color: 'var(--text-4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(a => (
                    <tr key={a.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.1s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(232,232,232,0.02)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)', marginBottom: 2 }}>{a.customer_name || '—'}</div>
                        <div style={{ fontSize: 10, color: 'var(--text-4)', fontFamily: 'var(--font-mono)' }}>{a.customer_phone?.startsWith('web_') ? 'Web chat' : a.customer_phone || '—'}</div>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--text-3)' }}>{a.service_type || '—'}</td>
                      <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--text)' }}>{a.preferred_time_text || '—'}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 99, background: a.customer_phone?.startsWith('web_') ? 'var(--green-dim)' : 'rgba(232,232,232,0.06)', color: a.customer_phone?.startsWith('web_') ? 'var(--green)' : 'var(--platinum-3)', border: '1px solid var(--border)' }}>
                          {a.customer_phone?.startsWith('web_') ? 'chat' : 'sms/voice'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px' }}><StatusTag status={a.status} /></td>
                      <td style={{ padding: '12px 16px', fontSize: 10, color: 'var(--text-4)' }}>{a.created_at ? formatDistanceToNow(new Date(a.created_at), { addSuffix: true }) : '—'}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <button onClick={() => setSelected(a)} style={{ padding: '4px 12px', borderRadius: 7, fontSize: 10, fontWeight: 500, color: 'var(--text-4)', background: 'transparent', border: '1px solid var(--border)', cursor: 'pointer', letterSpacing: '0.04em', transition: 'all 0.12s' }}
                          onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.borderColor = 'var(--border-2)' }}
                          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-4)'; e.currentTarget.style.borderColor = 'var(--border)' }}>
                          {a.status === 'pending' ? 'Review' : 'View'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          }
        </div>
      )}

      {selected && <Modal appt={selected} onClose={() => setSelected(null)} onAction={handleAction} />}
    </div>
  )
}

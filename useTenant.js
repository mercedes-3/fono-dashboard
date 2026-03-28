import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { formatDistanceToNow } from 'date-fns'

function Stat({ label, value, sub, color }) {
  return (
    <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--text-4)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>{label}</div>
      <div style={{ fontSize: 36, fontWeight: 300, fontFamily: 'var(--font-display)', color: color || 'var(--text)', letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 10, color: 'var(--text-4)', marginTop: 8, letterSpacing: '0.03em' }}>{sub}</div>}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, ${color || 'var(--platinum-6)'}, transparent)`, opacity: 0.4 }} />
    </div>
  )
}

export default function Overview({ tenant, user }) {
  const [leads, setLeads] = useState([])
  const [appts, setAppts] = useState([])
  const [calls, setCalls] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { if (tenant?.id) load() }, [tenant])

  async function load() {
    setLoading(true)
    const [l, a, c] = await Promise.all([
      supabase.from('leads').select('*').eq('tenant_id', tenant.id).order('created_at', { ascending: false }).limit(5),
      supabase.from('appointment_requests').select('*').eq('tenant_id', tenant.id).eq('status', 'pending').order('created_at', { ascending: false }).limit(5),
      supabase.from('call_logs').select('*').eq('tenant_id', tenant.id).order('created_at', { ascending: false }).limit(5),
    ])
    setLeads(l.data || [])
    setAppts(a.data || [])
    setCalls(c.data || [])
    setLoading(false)
  }

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  if (!tenant) return (
    <div style={{ padding: 40 }}>
      <div className="card" style={{ textAlign: 'center', padding: '64px 32px' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 300, color: 'var(--platinum)', marginBottom: 12, fontStyle: 'italic' }}>Welcome to Fono</div>
        <p style={{ fontSize: 12, color: 'var(--text-4)', maxWidth: 280, margin: '0 auto' }}>Your account isn't linked to a business yet. Visit Setup to get started.</p>
      </div>
    </div>
  )

  return (
    <div style={{ padding: 40, maxWidth: 920 }} className="fade-up">
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ fontSize: 11, color: 'var(--text-4)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>{greeting}</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 300, color: 'var(--text)', letterSpacing: '-0.01em' }}>{tenant.name}</h1>
        {!tenant.twilio_number && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            marginTop: 14, padding: '8px 14px',
            background: 'var(--amber-dim)',
            border: '1px solid rgba(251,191,36,0.15)',
            borderRadius: 8, fontSize: 11, color: 'var(--amber)',
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            AI receptionist not active — complete Setup to get your number
          </div>
        )}
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 28 }}>
        <Stat label="Leads captured" value={loading ? '—' : leads.length} sub="Recent activity" color="var(--platinum-2)" />
        <Stat label="Calls logged" value={loading ? '—' : calls.length} sub="Recent activity" />
        <Stat label="Pending appointments" value={loading ? '—' : appts.length} sub="Awaiting confirmation" color={appts.length > 0 ? 'var(--amber)' : undefined} />
      </div>

      {/* Two columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Recent leads */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)' }}>Recent Leads</span>
            <a href="/dashboard/leads" style={{ fontSize: 10, color: 'var(--text-4)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>View all →</a>
          </div>
          {loading ? <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}><div className="spinner" /></div>
          : leads.length === 0 ? <div className="empty"><p>No leads yet</p></div>
          : leads.map(l => (
            <div key={l.id} style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)', marginBottom: 2 }}>{l.full_name || l.phone || 'Unknown'}</div>
                <div style={{ fontSize: 10, color: 'var(--text-4)' }}>{l.service_type || 'No service'} · {l.phone?.startsWith('web_') ? 'Chat' : 'SMS/Voice'}</div>
              </div>
              <span className={`badge ${l.intake_status === 'schedule_captured' ? 'badge-green' : 'badge-plat'}`}>{l.intake_status || 'new'}</span>
            </div>
          ))}
        </div>

        {/* Pending appointments */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)' }}>Pending Appointments</span>
            <a href="/dashboard/appointments" style={{ fontSize: 10, color: 'var(--text-4)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>View all →</a>
          </div>
          {loading ? <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}><div className="spinner" /></div>
          : appts.length === 0 ? <div className="empty"><p>No pending appointments</p></div>
          : appts.map(a => (
            <div key={a.id} style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)', marginBottom: 2 }}>{a.customer_name || 'Unknown'}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-4)' }}>{a.service_type} · {a.preferred_time_text}</div>
                </div>
                <span className="badge badge-amber">pending</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { formatDistanceToNow } from 'date-fns'

function StatCard({ label, value, sub, accent }) {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{label}</span>
      <span style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em', color: accent || 'var(--text)' }}>{value}</span>
      {sub && <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{sub}</span>}
    </div>
  )
}

export default function Overview({ tenant, user }) {
  const [leads, setLeads] = useState([])
  const [calls, setCalls] = useState([])
  const [appts, setAppts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (tenant?.id) loadData()
  }, [tenant])

  async function loadData() {
    setLoading(true)
    const [l, c, a] = await Promise.all([
      supabase.from('leads').select('*').eq('tenant_id', tenant.id).order('created_at', { ascending: false }).limit(5),
      supabase.from('call_logs').select('*').eq('tenant_id', tenant.id).order('created_at', { ascending: false }).limit(5),
      supabase.from('appointment_requests').select('*').eq('tenant_id', tenant.id).eq('status', 'pending').order('created_at', { ascending: false }).limit(5),
    ])
    setLeads(l.data || [])
    setCalls(c.data || [])
    setAppts(a.data || [])
    setLoading(false)
  }

  const totalLeads = leads.length
  const totalCalls = calls.length
  const pendingAppts = appts.length

  if (!tenant) return (
    <div style={{ padding: 32 }}>
      <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>👋</div>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Welcome to Fono</h2>
        <p style={{ color: 'var(--text-3)', fontSize: 13, marginBottom: 20 }}>Your account isn't linked to a business yet. Go to Setup to get started.</p>
      </div>
    </div>
  )

  return (
    <div style={{ padding: 32, maxWidth: 900 }} className="fade-in">
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'} 👋
        </h1>
        <p style={{ color: 'var(--text-3)', fontSize: 13, marginTop: 4 }}>{tenant.name} · AI Receptionist Dashboard</p>
      </div>

      {/* AI Status banner */}
      {!tenant.twilio_number && (
        <div style={{
          background: 'var(--yellow-dim)',
          border: '1px solid rgba(245,158,11,0.2)',
          borderRadius: 10,
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 24,
          fontSize: 13,
          color: 'var(--yellow)',
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span>Your AI receptionist isn't active yet — go to <strong>Setup</strong> to get your phone number.</span>
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 28 }}>
        <StatCard label="Leads (recent)" value={loading ? '—' : totalLeads} sub="Last 5 captured" accent="var(--accent-2)" />
        <StatCard label="Calls logged" value={loading ? '—' : totalCalls} sub="Last 5 calls" />
        <StatCard label="Pending appts" value={loading ? '—' : pendingAppts} sub="Awaiting confirmation" accent={pendingAppts > 0 ? 'var(--yellow)' : undefined} />
      </div>

      {/* Recent leads + pending appointments */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Recent Leads */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Recent Leads</span>
            <a href="/dashboard/leads" style={{ fontSize: 11, color: 'var(--accent-2)' }}>View all →</a>
          </div>
          {loading ? <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}><div className="spinner" /></div>
          : leads.length === 0 ? (
            <div className="empty-state">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
              <p>No leads yet</p>
            </div>
          ) : leads.map(lead => (
            <div key={lead.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '9px 0',
              borderBottom: '1px solid var(--border)',
              gap: 12,
            }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {lead.full_name || lead.phone || 'Unknown'}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-3)' }}>
                  {lead.service_type || 'No service type'} · {lead.phone?.startsWith('web_') ? 'Chat' : 'SMS'}
                </div>
              </div>
              <span className={`badge ${lead.intake_status === 'schedule_captured' ? 'badge-green' : 'badge-blue'}`}>
                {lead.intake_status || 'new'}
              </span>
            </div>
          ))}
        </div>

        {/* Pending Appointments */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Pending Appointments</span>
          </div>
          {loading ? <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}><div className="spinner" /></div>
          : appts.length === 0 ? (
            <div className="empty-state">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <p>No pending appointments</p>
            </div>
          ) : appts.map(appt => (
            <div key={appt.id} style={{
              padding: '10px 0',
              borderBottom: '1px solid var(--border)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{appt.customer_name || 'Unknown'}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{appt.service_type} · {appt.preferred_time_text}</div>
                </div>
                <span className="badge badge-yellow">pending</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

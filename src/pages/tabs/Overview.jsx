import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

function Stat({ label, value, sub, color }) {
  return (
    <div style={{ background: 'var(--black-3)', border: '1px solid var(--border)', borderRadius: 12, padding: '24px 28px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--text-4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>{label}</div>
      <div style={{ fontSize: 48, fontWeight: 300, fontFamily: 'var(--font-display)', color: color || 'var(--text)', letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 10, color: 'var(--text-4)', marginTop: 12, letterSpacing: '0.03em' }}>{sub}</div>}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, ${color || 'rgba(232,232,232,0.1)'}, transparent)` }} />
    </div>
  )
}

function SectionCard({ title, link, loading, children }) {
  return (
    <div style={{ background: 'var(--black-3)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{title}</span>
        {link && <a href={link.href} style={{ fontSize: 10, color: 'var(--text-4)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{link.label} →</a>}
      </div>
      {loading
        ? <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}><div className="spinner" /></div>
        : children
      }
    </div>
  )
}

function Empty({ text }) {
  return <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-4)', fontSize: 11, letterSpacing: '0.04em' }}>{text}</div>
}

function StatusPill({ status }) {
  const map = {
    schedule_captured: { label: 'Complete', bg: 'var(--green-dim)', color: 'var(--green)', border: 'rgba(74,222,128,0.15)' },
    collecting:        { label: 'Collecting', bg: 'var(--black-5)', color: 'var(--text-4)', border: 'var(--border)' },
    pending:           { label: 'Pending', bg: 'var(--amber-dim)', color: 'var(--amber)', border: 'rgba(251,191,36,0.15)' },
    new:               { label: 'New', bg: 'var(--black-5)', color: 'var(--text-4)', border: 'var(--border)' },
  }
  const s = map[status] || map.new
  return (
    <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 99, background: s.bg, color: s.color, border: `1px solid ${s.border}`, whiteSpace: 'nowrap' }}>
      {s.label}
    </span>
  )
}

export default function Overview({ tenant }) {
  const [leads, setLeads] = useState([])
  const [appts, setAppts] = useState([])
  const [leadCount, setLeadCount] = useState(0)
  const [callCount, setCallCount] = useState(0)
  const [apptCount, setApptCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => { if (tenant?.id) load() }, [tenant])

  async function load() {
    setLoading(true)
    const [l, a, lCount, cCount, aCount] = await Promise.all([
      supabase.from('leads').select('*').eq('tenant_id', tenant.id).order('created_at', { ascending: false }).limit(5),
      supabase.from('appointment_requests').select('*').eq('tenant_id', tenant.id).eq('status', 'pending').order('created_at', { ascending: false }).limit(5),
      supabase.from('leads').select('*', { count: 'exact', head: true }).eq('tenant_id', tenant.id),
      supabase.from('call_logs').select('*', { count: 'exact', head: true }).eq('tenant_id', tenant.id),
      supabase.from('appointment_requests').select('*', { count: 'exact', head: true }).eq('tenant_id', tenant.id).eq('status', 'pending'),
    ])
    setLeads(l.data || [])
    setAppts(a.data || [])
    setLeadCount(lCount.count || 0)
    setCallCount(cCount.count || 0)
    setApptCount(aCount.count || 0)
    setLoading(false)
  }

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  if (!tenant) return (
    <div style={{ padding: 40 }}>
      <div style={{ background: 'var(--black-3)', border: '1px solid var(--border)', borderRadius: 12, padding: '64px 32px', textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 300, color: 'var(--platinum)', marginBottom: 12, fontStyle: 'italic' }}>Welcome to Fono</div>
        <p style={{ fontSize: 12, color: 'var(--text-4)', maxWidth: 280, margin: '0 auto', lineHeight: 1.7 }}>Your account isn't linked to a business yet. Visit Setup to get started.</p>
      </div>
    </div>
  )

  return (
    <div style={{ padding: 40, maxWidth: 900 }}>
      <div style={{ marginBottom: 36 }}>
        <div style={{ fontSize: 10, color: 'var(--text-4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>{greeting}</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 300, color: 'var(--text)', letterSpacing: '-0.01em', lineHeight: 1 }}>{tenant.name}</h1>
        {!tenant.twilio_number && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 16, padding: '8px 14px', background: 'var(--amber-dim)', border: '1px solid rgba(251,191,36,0.15)', borderRadius: 8, fontSize: 11, color: 'var(--amber)' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            AI receptionist not active — complete Setup to get your number
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        <Stat label="Leads captured" value={loading ? '—' : leadCount} sub="Total leads" color="var(--platinum-2)" />
        <Stat label="Calls logged" value={loading ? '—' : callCount} sub="Total calls" color="var(--platinum-4)" />
        <Stat label="Pending appointments" value={loading ? '—' : apptCount} sub="Awaiting confirmation" color={apptCount > 0 ? 'var(--amber)' : 'var(--platinum-4)'} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <SectionCard title="Recent Leads" link={{ href: '/dashboard/leads', label: 'View all' }} loading={loading}>
          {leads.length === 0
            ? <Empty text="No leads yet" />
            : leads.map(l => (
              <div key={l.id} style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)', marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.full_name || l.phone || 'Unknown'}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-4)', letterSpacing: '0.02em' }}>{l.service_type || 'No service'} · {l.source === 'voice' ? 'Voice' : l.phone?.startsWith('web_') ? 'Chat' : 'SMS'}</div>
                </div>
                <StatusPill status={l.intake_status} />
              </div>
            ))
          }
        </SectionCard>

        <SectionCard title="Pending Appointments" link={{ href: '/dashboard/appointments', label: 'View all' }} loading={loading}>
          {appts.length === 0
            ? <Empty text="No pending appointments" />
            : appts.map(a => (
              <div key={a.id} style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)', marginBottom: 3 }}>{a.customer_name || 'Unknown'}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-4)', letterSpacing: '0.02em' }}>{a.service_type} · {a.preferred_time_text}</div>
                </div>
                <StatusPill status="pending" />
              </div>
            ))
          }
        </SectionCard>
      </div>
    </div>
  )
}

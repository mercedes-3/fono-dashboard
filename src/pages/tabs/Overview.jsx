import { useState, useEffect, useMemo } from 'react'
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
        {link && <a href={link.href} style={{ fontSize: 10, color: 'var(--text-4)', letterSpacing: '0.04em', textTransform: 'uppercase', textDecoration: 'none' }}>{link.label} →</a>}
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

function MiniBar({ value, max, color, label, count }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0' }}>
      <div style={{ width: 70, fontSize: 10, color: 'var(--text-4)', letterSpacing: '0.02em', textTransform: 'capitalize', flexShrink: 0 }}>{label}</div>
      <div style={{ flex: 1, height: 6, background: 'var(--black-5)', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 99, transition: 'width 0.5s ease' }} />
      </div>
      <div style={{ width: 32, fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-4)', textAlign: 'right' }}>{count}</div>
    </div>
  )
}

function SimpleBarChart({ data, height = 120 }) {
  if (!data || data.length === 0) return <Empty text="No data yet" />
  const maxVal = Math.max(...data.map(d => d.value), 1)
  const barWidth = Math.max(Math.floor((100 / data.length) - 2), 4)

  return (
    <div style={{ padding: '16px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height, gap: 3 }}>
        {data.map((d, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: 4 }}>
            <div style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: 'var(--text-4)' }}>{d.value > 0 ? d.value : ''}</div>
            <div style={{
              width: '100%', maxWidth: 32,
              height: `${Math.max((d.value / maxVal) * (height - 30), 2)}px`,
              background: d.color || 'var(--platinum)',
              borderRadius: '4px 4px 0 0',
              opacity: d.value > 0 ? 1 : 0.2,
              transition: 'height 0.5s ease',
            }} />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, borderTop: '1px solid var(--border)', paddingTop: 8 }}>
        {data.map((d, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: 8, color: 'var(--text-4)', letterSpacing: '0.04em' }}>{d.label}</div>
        ))}
      </div>
    </div>
  )
}

function ConversionFunnel({ steps }) {
  const maxVal = Math.max(...steps.map(s => s.value), 1)
  return (
    <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      {steps.map((step, i) => {
        const pct = Math.round((step.value / maxVal) * 100)
        const convRate = i > 0 && steps[i - 1].value > 0
          ? Math.round((step.value / steps[i - 1].value) * 100)
          : null
        return (
          <div key={step.label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 10, color: 'var(--text-4)', letterSpacing: '0.02em' }}>{step.label}</span>
              <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>
                {step.value}
                {convRate !== null && <span style={{ color: 'var(--text-4)', marginLeft: 6 }}>{convRate}%</span>}
              </span>
            </div>
            <div style={{ height: 6, background: 'var(--black-5)', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: step.color || 'var(--platinum)', borderRadius: 99, transition: 'width 0.5s ease' }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function Overview({ tenant }) {
  const [leads, setLeads] = useState([])
  const [allLeads, setAllLeads] = useState([])
  const [appts, setAppts] = useState([])
  const [allAppts, setAllAppts] = useState([])
  const [calls, setCalls] = useState([])
  const [leadCount, setLeadCount] = useState(0)
  const [callCount, setCallCount] = useState(0)
  const [apptCount, setApptCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => { if (tenant?.id) load() }, [tenant])

  async function load() {
    setLoading(true)
    const [l, recentLeads, a, allA, c, lCount, cCount, aCount] = await Promise.all([
      supabase.from('leads').select('*').eq('tenant_id', tenant.id).order('created_at', { ascending: false }),
      supabase.from('leads').select('*').eq('tenant_id', tenant.id).order('created_at', { ascending: false }).limit(5),
      supabase.from('appointment_requests').select('*').eq('tenant_id', tenant.id).eq('status', 'pending').order('created_at', { ascending: false }).limit(5),
      supabase.from('appointment_requests').select('*').eq('tenant_id', tenant.id).order('created_at', { ascending: false }),
      supabase.from('call_logs').select('*').eq('tenant_id', tenant.id).order('created_at', { ascending: false }),
      supabase.from('leads').select('*', { count: 'exact', head: true }).eq('tenant_id', tenant.id),
      supabase.from('call_logs').select('*', { count: 'exact', head: true }).eq('tenant_id', tenant.id),
      supabase.from('appointment_requests').select('*', { count: 'exact', head: true }).eq('tenant_id', tenant.id).eq('status', 'pending'),
    ])
    setAllLeads(l.data || [])
    setLeads(recentLeads.data || [])
    setAppts(a.data || [])
    setAllAppts(allA.data || [])
    setCalls(c.data || [])
    setLeadCount(lCount.count || 0)
    setCallCount(cCount.count || 0)
    setApptCount(aCount.count || 0)
    setLoading(false)
  }

  // Analytics calculations
  const analytics = useMemo(() => {
    if (loading) return null

    // Lead sources
    const sources = allLeads.reduce((acc, l) => {
      const src = l.source === 'voice' ? 'voice' : l.phone?.startsWith('web_') ? 'chat' : l.source === 'facebook' ? 'facebook' : 'sms'
      acc[src] = (acc[src] || 0) + 1
      return acc
    }, {})

    // Pipeline stages
    const stages = allLeads.reduce((acc, l) => {
      const s = l.pipeline_stage || 'new'
      acc[s] = (acc[s] || 0) + 1
      return acc
    }, {})

    // Sentiment breakdown
    const sentiments = allLeads.reduce((acc, l) => {
      const s = l.sentiment || 'neutral'
      acc[s] = (acc[s] || 0) + 1
      return acc
    }, {})

    // Conversion funnel
    const totalLeads = allLeads.length
    const contacted = allLeads.filter(l => l.pipeline_stage && l.pipeline_stage !== 'new').length
    const quoted = allLeads.filter(l => ['quoted', 'won'].includes(l.pipeline_stage)).length
    const won = allLeads.filter(l => l.pipeline_stage === 'won').length
    const totalAppts = allAppts.length
    const confirmedAppts = allAppts.filter(a => a.status === 'confirmed').length

    // Calls by day of week (last 30 days)
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const callsByDay = [0, 0, 0, 0, 0, 0, 0]
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    calls.forEach(c => {
      const d = new Date(c.created_at)
      if (d >= thirtyDaysAgo) callsByDay[d.getDay()]++
    })

    // Leads by week (last 8 weeks)
    const weekData = []
    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date()
      weekStart.setDate(weekStart.getDate() - (i * 7))
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekEnd.getDate() + 7)
      const count = allLeads.filter(l => {
        const d = new Date(l.created_at)
        return d >= weekStart && d < weekEnd
      }).length
      const label = `W${8 - i}`
      weekData.push({ label, value: count, color: 'var(--platinum)' })
    }

    // Hot leads
    const hotLeads = allLeads.filter(l => (l.lead_score || 0) >= 70).length

    // Average lead score
    const avgScore = allLeads.length > 0
      ? Math.round(allLeads.reduce((sum, l) => sum + (l.lead_score || 0), 0) / allLeads.length)
      : 0

    // Estimated revenue (won leads * avg job value estimate)
    const avgJobValue = 350
    const estimatedRevenue = won * avgJobValue

    // Response rate
    const completedLeads = allLeads.filter(l => l.intake_status === 'schedule_captured').length
    const completionRate = totalLeads > 0 ? Math.round((completedLeads / totalLeads) * 100) : 0

    return {
      sources, stages, sentiments, totalLeads, contacted, quoted, won,
      totalAppts, confirmedAppts, callsByDay, dayNames, weekData,
      hotLeads, avgScore, estimatedRevenue, completionRate, completedLeads,
    }
  }, [loading, allLeads, allAppts, calls])

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
    <div style={{ padding: 40, maxWidth: 960 }}>
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

      {/* Top Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        <Stat label="Leads Captured" value={loading ? '—' : leadCount} sub="Total leads" color="var(--platinum-2)" />
        <Stat label="Calls Logged" value={loading ? '—' : callCount} sub="Total calls" color="var(--platinum-4)" />
        <Stat label="Pending Appts" value={loading ? '—' : apptCount} sub="Awaiting confirmation" color={apptCount > 0 ? 'var(--amber)' : 'var(--platinum-4)'} />
        <Stat label="Est. Revenue" value={loading ? '—' : `$${(analytics?.estimatedRevenue || 0).toLocaleString()}`} sub={`${analytics?.won || 0} won jobs`} color="var(--green)" />
      </div>

      {/* ROI Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        <div style={{ background: 'var(--black-3)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: 9, color: 'var(--text-4)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Completion Rate</div>
          <div style={{ fontSize: 28, fontFamily: 'var(--font-display)', fontWeight: 300, color: (analytics?.completionRate || 0) >= 50 ? 'var(--green)' : 'var(--amber)' }}>{loading ? '—' : `${analytics?.completionRate || 0}%`}</div>
        </div>
        <div style={{ background: 'var(--black-3)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: 9, color: 'var(--text-4)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Avg Lead Score</div>
          <div style={{ fontSize: 28, fontFamily: 'var(--font-display)', fontWeight: 300, color: (analytics?.avgScore || 0) >= 50 ? 'var(--green)' : 'var(--text-4)' }}>{loading ? '—' : analytics?.avgScore || 0}</div>
        </div>
        <div style={{ background: 'var(--black-3)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: 9, color: 'var(--text-4)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Hot Leads</div>
          <div style={{ fontSize: 28, fontFamily: 'var(--font-display)', fontWeight: 300, color: 'var(--green)' }}>{loading ? '—' : analytics?.hotLeads || 0}</div>
        </div>
        <div style={{ background: 'var(--black-3)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: 9, color: 'var(--text-4)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Appts Confirmed</div>
          <div style={{ fontSize: 28, fontFamily: 'var(--font-display)', fontWeight: 300, color: 'var(--platinum)' }}>{loading ? '—' : analytics?.confirmedAppts || 0}</div>
        </div>
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
        <SectionCard title="Leads by Week" loading={loading}>
          <SimpleBarChart data={analytics?.weekData || []} />
        </SectionCard>

        <SectionCard title="Calls by Day" loading={loading}>
          <SimpleBarChart
            data={(analytics?.dayNames || []).map((name, i) => ({
              label: name,
              value: analytics?.callsByDay?.[i] || 0,
              color: i === 0 || i === 6 ? 'var(--text-4)' : 'var(--platinum)',
            }))}
          />
        </SectionCard>
      </div>

      {/* Middle Row: Funnel + Sources */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
        <SectionCard title="Conversion Funnel" loading={loading}>
          <ConversionFunnel steps={[
            { label: 'Leads Captured', value: analytics?.totalLeads || 0, color: 'var(--platinum)' },
            { label: 'Info Completed', value: analytics?.completedLeads || 0, color: 'var(--platinum-3)' },
            { label: 'Contacted', value: analytics?.contacted || 0, color: 'var(--amber)' },
            { label: 'Quoted', value: analytics?.quoted || 0, color: 'var(--blue)' },
            { label: 'Won', value: analytics?.won || 0, color: 'var(--green)' },
          ]} />
        </SectionCard>

        <SectionCard title="Lead Sources" loading={loading}>
          <div style={{ padding: '12px 20px' }}>
            {analytics && Object.keys(analytics.sources).length > 0 ? (
              <>
                <MiniBar label="Voice" value={analytics.sources.voice || 0} max={analytics.totalLeads} count={analytics.sources.voice || 0} color="var(--platinum)" />
                <MiniBar label="SMS" value={analytics.sources.sms || 0} max={analytics.totalLeads} count={analytics.sources.sms || 0} color="var(--blue)" />
                <MiniBar label="Chat" value={analytics.sources.chat || 0} max={analytics.totalLeads} count={analytics.sources.chat || 0} color="var(--green)" />
                <MiniBar label="Facebook" value={analytics.sources.facebook || 0} max={analytics.totalLeads} count={analytics.sources.facebook || 0} color="#1877F2" />
              </>
            ) : <Empty text="No lead data yet" />}
          </div>
        </SectionCard>
      </div>

      {/* Sentiment + Pipeline Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
        <SectionCard title="Caller Sentiment" loading={loading}>
          <div style={{ padding: '12px 20px' }}>
            {analytics && Object.keys(analytics.sentiments).length > 0 ? (
              <>
                <MiniBar label="Urgent" value={analytics.sentiments.urgent || 0} max={analytics.totalLeads} count={analytics.sentiments.urgent || 0} color="var(--red)" />
                <MiniBar label="Frustrated" value={analytics.sentiments.frustrated || 0} max={analytics.totalLeads} count={analytics.sentiments.frustrated || 0} color="var(--amber)" />
                <MiniBar label="Anxious" value={analytics.sentiments.anxious || 0} max={analytics.totalLeads} count={analytics.sentiments.anxious || 0} color="var(--amber)" />
                <MiniBar label="Neutral" value={analytics.sentiments.neutral || 0} max={analytics.totalLeads} count={analytics.sentiments.neutral || 0} color="var(--text-4)" />
                <MiniBar label="Friendly" value={analytics.sentiments.friendly || 0} max={analytics.totalLeads} count={analytics.sentiments.friendly || 0} color="var(--blue)" />
                <MiniBar label="Happy" value={analytics.sentiments.happy || 0} max={analytics.totalLeads} count={analytics.sentiments.happy || 0} color="var(--green)" />
              </>
            ) : <Empty text="No sentiment data yet" />}
          </div>
        </SectionCard>

        <SectionCard title="Pipeline Breakdown" loading={loading}>
          <div style={{ padding: '12px 20px' }}>
            {analytics && analytics.totalLeads > 0 ? (
              <>
                <MiniBar label="New" value={analytics.stages.new || 0} max={analytics.totalLeads} count={analytics.stages.new || 0} color="var(--text-4)" />
                <MiniBar label="Contacted" value={analytics.stages.contacted || 0} max={analytics.totalLeads} count={analytics.stages.contacted || 0} color="var(--amber)" />
                <MiniBar label="Quoted" value={analytics.stages.quoted || 0} max={analytics.totalLeads} count={analytics.stages.quoted || 0} color="var(--platinum)" />
                <MiniBar label="Won" value={analytics.stages.won || 0} max={analytics.totalLeads} count={analytics.stages.won || 0} color="var(--green)" />
                <MiniBar label="Lost" value={analytics.stages.lost || 0} max={analytics.totalLeads} count={analytics.stages.lost || 0} color="var(--red)" />
              </>
            ) : <Empty text="No pipeline data yet" />}
          </div>
        </SectionCard>
      </div>

      {/* Recent Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <SectionCard title="Recent Leads" link={{ href: '/dashboard/leads', label: 'View all' }} loading={loading}>
          {leads.length === 0
            ? <Empty text="No leads yet" />
            : leads.map(l => (
              <div key={l.id} style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)', marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.full_name || l.phone || 'Unknown'}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-4)', letterSpacing: '0.02em' }}>{l.service_type || 'No service'} · {l.source === 'voice' ? 'Voice' : l.phone?.startsWith('web_') ? 'Chat' : l.source === 'facebook' ? 'Facebook' : 'SMS'}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {l.lead_score > 0 && (
                    <span style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: (l.lead_score || 0) >= 70 ? 'var(--green)' : (l.lead_score || 0) >= 40 ? 'var(--amber)' : 'var(--text-4)' }}>{l.lead_score}</span>
                  )}
                  <StatusPill status={l.intake_status} />
                </div>
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

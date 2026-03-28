import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const ADMIN_EMAIL = 'cedesnm@icloud.com'

function StatBox({ label, value, color }) {
  return (
    <div style={{ background: 'var(--black-3)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 24px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--text-4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 300, color: color || 'var(--text)', lineHeight: 1 }}>{value}</div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, ${color || 'rgba(232,232,232,0.1)'}, transparent)` }} />
    </div>
  )
}

function Tag({ label, color, bg, border }) {
  return (
    <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 99, background: bg, color, border: `1px solid ${border}`, whiteSpace: 'nowrap' }}>
      {label}
    </span>
  )
}

function TenantModal({ tenant, leads, onClose, onUpdate }) {
  const [dispatchPhone, setDispatchPhone] = useState(tenant.dispatch_phone || '')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  const toggleActive = async () => {
    setSaving(true)
    const { error } = await supabase.from('tenants').update({ pilot_mode: !tenant.pilot_mode }).eq('id', tenant.id)
    if (!error) { onUpdate(); setMsg(tenant.pilot_mode ? '✅ Tenant activated' : '✅ Tenant deactivated') }
    else setMsg(`❌ ${error.message}`)
    setSaving(false)
  }

  const savePhone = async () => {
    setSaving(true)
    const { error } = await supabase.from('tenants').update({ dispatch_phone: dispatchPhone }).eq('id', tenant.id)
    if (!error) { onUpdate(); setMsg('✅ Phone updated') }
    else setMsg(`❌ ${error.message}`)
    setSaving(false)
  }

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 480, background: 'var(--black-3)', border: '1px solid var(--border-2)', borderRadius: 14, padding: 28, maxHeight: '85vh', overflowY: 'auto' }}>
        
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 9, color: 'var(--text-4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Tenant Management</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 300, color: 'var(--text)' }}>{tenant.name}</div>
        </div>

        {/* Account Info */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
          {[
            ['Business Type', tenant.business_type],
            ['AI Number', tenant.twilio_number || 'Not provisioned'],
            ['Dispatch Phone', tenant.dispatch_phone || 'Not set'],
            ['Status', tenant.pilot_mode ? 'Pilot Mode' : 'Active'],
            ['Leads', leads.total],
            ['Completed', leads.completed],
          ].map(([label, value]) => (
            <div key={label}>
              <div style={{ fontSize: 9, color: 'var(--text-4)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 5 }}>{label}</div>
              <div style={{ fontSize: 12, color: 'var(--text)', fontFamily: label === 'AI Number' || label === 'Dispatch Phone' ? 'var(--font-mono)' : 'inherit' }}>{value || '—'}</div>
            </div>
          ))}
        </div>

        <div style={{ height: 1, background: 'var(--border)', margin: '20px 0' }} />

        {/* Edit Dispatch Phone */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 9, fontWeight: 600, color: 'var(--text-4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Update Dispatch Phone</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={dispatchPhone}
              onChange={e => setDispatchPhone(e.target.value)}
              placeholder="+19151234567"
              style={{ flex: 1, background: 'var(--black-4)', border: '1px solid var(--border-2)', borderRadius: 8, padding: '9px 12px', color: 'var(--text)', fontSize: 12, outline: 'none', fontFamily: 'var(--font-mono)' }}
            />
            <button onClick={savePhone} disabled={saving} style={{ padding: '9px 16px', borderRadius: 8, fontSize: 11, fontWeight: 500, background: 'var(--platinum)', color: 'var(--black)', border: 'none', cursor: 'pointer', letterSpacing: '0.04em' }}>
              Save
            </button>
          </div>
        </div>

        {/* Recent Leads */}
        {leads.recent?.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--text-4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Recent Leads</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {leads.recent.map(l => (
                <div key={l.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--black-4)', borderRadius: 7, border: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text)' }}>{l.full_name || l.phone || 'Unknown'}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-4)' }}>{l.service_type || 'No service'}</div>
                  </div>
                  <Tag
                    label={l.intake_status === 'schedule_captured' ? 'Complete' : l.intake_status || 'New'}
                    color={l.intake_status === 'schedule_captured' ? 'var(--green)' : 'var(--text-4)'}
                    bg={l.intake_status === 'schedule_captured' ? 'var(--green-dim)' : 'var(--black-5)'}
                    border={l.intake_status === 'schedule_captured' ? 'rgba(74,222,128,0.15)' : 'var(--border)'}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {msg && <div style={{ padding: '8px 12px', borderRadius: 7, fontSize: 12, marginBottom: 16, background: msg.startsWith('✅') ? 'var(--green-dim)' : 'var(--red-dim)', color: msg.startsWith('✅') ? 'var(--green)' : 'var(--red)', border: `1px solid ${msg.startsWith('✅') ? 'rgba(74,222,128,0.15)' : 'rgba(248,113,113,0.15)'}` }}>{msg}</div>}

        <div style={{ height: 1, background: 'var(--border)', margin: '20px 0' }} />

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={toggleActive} disabled={saving} style={{
            flex: 1, padding: '10px', borderRadius: 8, fontSize: 11, fontWeight: 500, cursor: 'pointer', letterSpacing: '0.04em',
            background: tenant.pilot_mode ? 'var(--green-dim)' : 'var(--red-dim)',
            color: tenant.pilot_mode ? 'var(--green)' : 'var(--red)',
            border: `1px solid ${tenant.pilot_mode ? 'rgba(74,222,128,0.15)' : 'rgba(248,113,113,0.15)'}`,
          }}>
            {tenant.pilot_mode ? 'Activate Account' : 'Deactivate Account'}
          </button>
          <button onClick={onClose} style={{ flex: 1, padding: '10px', borderRadius: 8, fontSize: 11, fontWeight: 500, background: 'transparent', color: 'var(--text-4)', border: '1px solid var(--border)', cursor: 'pointer' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Admin() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [tenants, setTenants] = useState([])
  const [leadCounts, setLeadCounts] = useState({})
  const [selected, setSelected] = useState(null)
  const [search, setSearch] = useState('')
  const [unauthorized, setUnauthorized] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session || session.user.email !== ADMIN_EMAIL) {
      setUnauthorized(true)
      setLoading(false)
      return
    }
    loadData()
  }

  async function loadData() {
    setLoading(true)
    const { data: tenantsData } = await supabase
      .from('tenants')
      .select('*')
      .order('created_at', { ascending: false })

    setTenants(tenantsData || [])

    // Load lead counts for each tenant
    if (tenantsData?.length) {
      const counts = {}
      await Promise.all(tenantsData.map(async (t) => {
        const { data: leads } = await supabase
          .from('leads')
          .select('id, intake_status, full_name, phone, service_type')
          .eq('tenant_id', t.id)
          .order('created_at', { ascending: false })
        counts[t.id] = {
          total: leads?.length || 0,
          completed: leads?.filter(l => l.intake_status === 'schedule_captured').length || 0,
          recent: leads?.slice(0, 3) || [],
        }
      }))
      setLeadCounts(counts)
    }

    setLoading(false)
  }

  if (unauthorized) return (
    <div style={{ minHeight: '100vh', background: 'var(--black)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font)' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 300, color: 'var(--text)', marginBottom: 10 }}>Access Denied</div>
        <p style={{ fontSize: 12, color: 'var(--text-4)', marginBottom: 24 }}>This page is restricted to authorized administrators.</p>
        <Link to="/dashboard" style={{ fontSize: 12, color: 'var(--platinum-3)', letterSpacing: '0.04em' }}>← Back to Dashboard</Link>
      </div>
    </div>
  )

  const filtered = tenants.filter(t => t.name?.toLowerCase().includes(search.toLowerCase()))
  const totalLeads = Object.values(leadCounts).reduce((sum, c) => sum + c.total, 0)
  const activeCount = tenants.filter(t => t.twilio_number).length

  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)', fontFamily: 'var(--font)', color: 'var(--text)' }}>
      {/* Top bar */}
      <div style={{ padding: '0 40px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', background: 'var(--black-2)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 22, height: 22, background: 'var(--platinum)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--black)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.91a16 16 0 006.09 6.09l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
              </svg>
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 500, color: 'var(--platinum)', letterSpacing: '0.04em' }}>fono</span>
          </div>
          <div style={{ width: 1, height: 16, background: 'var(--border-2)' }} />
          <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Admin</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={loadData} style={{ fontSize: 10, color: 'var(--text-4)', background: 'transparent', border: '1px solid var(--border)', borderRadius: 6, padding: '5px 12px', cursor: 'pointer', letterSpacing: '0.04em' }}>Refresh</button>
          <Link to="/dashboard" style={{ fontSize: 10, color: 'var(--text-4)', letterSpacing: '0.04em' }}>← Dashboard</Link>
        </div>
      </div>

      <div style={{ padding: 40, maxWidth: 1100 }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 10, color: 'var(--text-4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Owner View</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 300, color: 'var(--text)', letterSpacing: '-0.01em' }}>Admin Dashboard</h1>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 28 }}>
          <StatBox label="Total Accounts" value={loading ? '—' : tenants.length} color="var(--platinum-2)" />
          <StatBox label="Active Numbers" value={loading ? '—' : activeCount} color="var(--green)" />
          <StatBox label="Total Leads" value={loading ? '—' : totalLeads} color="var(--platinum-4)" />
          <StatBox label="Meta Ads" value="—" color="var(--platinum-6)" />
        </div>

        {/* Meta Ads placeholder */}
        <div style={{ background: 'var(--black-3)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 24px', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--text-4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Facebook / Meta Ads</div>
              <div style={{ fontSize: 12, color: 'var(--text-4)' }}>Meta ads integration coming soon — ad spend, leads, and ROAS per account will appear here</div>
            </div>
            <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--amber)', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: 99, background: 'var(--amber-dim)', border: '1px solid rgba(251,191,36,0.15)' }}>Coming Soon</div>
          </div>
        </div>

        {/* Search */}
        <div style={{ marginBottom: 16 }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search accounts..."
            style={{ width: '100%', maxWidth: 300, background: 'var(--black-3)', border: '1px solid var(--border-2)', borderRadius: 8, padding: '9px 14px', color: 'var(--text)', fontSize: 12, outline: 'none', fontFamily: 'inherit' }}
          />
        </div>

        {/* Tenants Table */}
        <div style={{ background: 'var(--black-3)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
          {loading
            ? <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}><div className="spinner" /></div>
            : filtered.length === 0
              ? <div style={{ padding: '48px 20px', textAlign: 'center', color: 'var(--text-4)', fontSize: 11, letterSpacing: '0.04em' }}>No accounts found</div>
              : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      {['Business', 'Type', 'AI Number', 'Dispatch', 'Leads', 'Completed', 'Status', 'Manage'].map(h => (
                        <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 9, fontWeight: 600, color: 'var(--text-4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(t => (
                      <tr key={t.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.1s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(232,232,232,0.02)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)' }}>{t.name}</div>
                          <div style={{ fontSize: 10, color: 'var(--text-4)', marginTop: 2 }}>{new Date(t.created_at).toLocaleDateString()}</div>
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: 11, color: 'var(--text-3)', textTransform: 'capitalize' }}>{t.business_type || '—'}</td>
                        <td style={{ padding: '12px 16px', fontSize: 11, fontFamily: 'var(--font-mono)', color: t.twilio_number ? 'var(--text)' : 'var(--text-4)' }}>{t.twilio_number || 'Not set'}</td>
                        <td style={{ padding: '12px 16px', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-3)' }}>{t.dispatch_phone || '—'}</td>
                        <td style={{ padding: '12px 16px', fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 300, color: 'var(--text)' }}>{leadCounts[t.id]?.total ?? '—'}</td>
                        <td style={{ padding: '12px 16px', fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 300, color: 'var(--green)' }}>{leadCounts[t.id]?.completed ?? '—'}</td>
                        <td style={{ padding: '12px 16px' }}>
                          {t.twilio_number
                            ? <Tag label="Active" color="var(--green)" bg="var(--green-dim)" border="rgba(74,222,128,0.15)" />
                            : <Tag label="Pending Setup" color="var(--amber)" bg="var(--amber-dim)" border="rgba(251,191,36,0.15)" />
                          }
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <button onClick={() => setSelected(t)} style={{ padding: '5px 12px', borderRadius: 7, fontSize: 10, fontWeight: 500, color: 'var(--text-4)', background: 'transparent', border: '1px solid var(--border)', cursor: 'pointer', letterSpacing: '0.04em', transition: 'all 0.12s' }}
                            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.borderColor = 'var(--border-2)' }}
                            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-4)'; e.currentTarget.style.borderColor = 'var(--border)' }}>
                            Manage →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
          }
        </div>
      </div>

      {selected && (
        <TenantModal
          tenant={selected}
          leads={leadCounts[selected.id] || { total: 0, completed: 0, recent: [] }}
          onClose={() => setSelected(null)}
          onUpdate={() => { loadData(); setSelected(null) }}
        />
      )}
    </div>
  )
}

// Setup.jsx
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import PageHeader from '../../components/PageHeader'

export function Setup({ tenant, reload }) {
  const [areaCode, setAreaCode] = useState('')
  const [provisioning, setProvisioning] = useState(false)
  const [provMsg, setProvMsg] = useState('')
  const [bizName, setBizName] = useState(tenant?.name || '')
  const [bizType, setBizType] = useState(tenant?.business_type || '')
  const [dispatch, setDispatch] = useState(tenant?.dispatch_phone || '')
  const [prompt, setPrompt] = useState(tenant?.ai_system_prompt || '')
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  const steps = [
    { label: 'Account Created', done: true },
    { label: 'Business Profile', done: !!(tenant?.name && tenant?.business_type) },
    { label: 'AI Phone Number', done: !!tenant?.twilio_number },
    { label: 'Dispatch Phone Set', done: !!tenant?.dispatch_phone },
  ]
  const progress = Math.round((steps.filter(s => s.done).length / steps.length) * 100)

  async function provision() {
    if (!/^\d{3}$/.test(areaCode)) { setProvMsg('Enter a valid 3-digit area code'); return }
    setProvisioning(true); setProvMsg('')
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch('https://nosnibbbggmlzavfylcd.supabase.co/functions/v1/provision-number', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
        body: JSON.stringify({ tenant_id: tenant.id, area_code: areaCode })
      })
      const data = await res.json()
      if (data.success) { setProvMsg(`✅ ${data.phone_number}`); reload() }
      else setProvMsg(`❌ ${data.error || 'Failed'}`)
    } catch (e) { setProvMsg(`❌ ${e.message}`) }
    setProvisioning(false)
  }

  async function save() {
    setSaving(true); setSaveMsg('')
    const { error } = await supabase.from('tenants').update({ name: bizName, business_type: bizType, dispatch_phone: dispatch, ai_system_prompt: prompt }).eq('id', tenant.id)
    if (error) setSaveMsg(`❌ ${error.message}`)
    else { setSaveMsg('✅ Saved'); reload() }
    setSaving(false)
  }

  if (!tenant) return <div style={{ padding: 40 }}><div className="card"><p style={{ color: 'var(--text-4)', fontSize: 12 }}>No tenant found.</p></div></div>

  return (
    <div style={{ padding: 40, maxWidth: 680 }} className="fade-up">
      <PageHeader title="Setup" sub="Configure your AI receptionist" />

      {/* Progress */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-2)' }}>Setup Progress</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 300, color: progress === 100 ? 'var(--green)' : 'var(--platinum)' }}>{progress}%</span>
        </div>
        <div style={{ height: 2, background: 'var(--black-5)', borderRadius: 99, overflow: 'hidden', marginBottom: 18 }}>
          <div style={{ height: '100%', width: `${progress}%`, background: progress === 100 ? 'var(--green)' : 'var(--platinum)', borderRadius: 99, transition: 'width 0.5s ease' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {steps.map(s => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', flexShrink: 0, background: s.done ? 'var(--green-dim)' : 'var(--black-5)', border: `1px solid ${s.done ? 'rgba(74,222,128,0.3)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {s.done && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
              </div>
              <span style={{ fontSize: 12, color: s.done ? 'var(--text)' : 'var(--text-4)' }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Business Profile */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 400, color: 'var(--text)', marginBottom: 18 }}>Business Profile</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div><label className="label">Business Name</label><input className="input" value={bizName} onChange={e => setBizName(e.target.value)} placeholder="Acme Plumbing" /></div>
          <div>
            <label className="label">Business Type</label>
            <select className="input" value={bizType} onChange={e => setBizType(e.target.value)} style={{ cursor: 'pointer' }}>
              <option value="">Select type...</option>
              {['plumbing','hvac','electrical','roofing','landscaping','remodeling','handyman','painting','flooring','pest control','cleaning','general contractor'].map(t => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
          </div>
          <div><label className="label">Dispatch Phone</label><input className="input" value={dispatch} onChange={e => setDispatch(e.target.value)} placeholder="+19151234567" /></div>
          <div>
            <label className="label">Custom AI Instructions</label>
            <textarea className="input" value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="e.g. We specialize in emergency plumbing in El Paso. Available Mon-Fri 7am-6pm, emergency calls 24/7." rows={4} style={{ resize: 'vertical' }} />
          </div>
          {saveMsg && <div style={{ padding: '8px 12px', borderRadius: 7, fontSize: 12, background: saveMsg.startsWith('✅') ? 'var(--green-dim)' : 'var(--red-dim)', color: saveMsg.startsWith('✅') ? 'var(--green)' : 'var(--red)' }}>{saveMsg}</div>}
          <button className="btn btn-primary" onClick={save} disabled={saving} style={{ alignSelf: 'flex-start' }}>
            {saving ? <><span className="spinner" />Saving...</> : 'Save Profile'}
          </button>
        </div>
      </div>

      {/* Phone */}
      <div className="card">
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 400, color: 'var(--text)', marginBottom: 6 }}>AI Phone Number</div>
        <p style={{ fontSize: 11, color: 'var(--text-4)', marginBottom: 18 }}>Dedicated local number for your AI receptionist</p>
        {tenant.twilio_number ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'var(--green-dim)', borderRadius: 8, border: '1px solid rgba(74,222,128,0.15)' }}>
            <div className="dot-live" />
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--green)', marginBottom: 2 }}>Active</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text)' }}>{tenant.twilio_number}</div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ flex: 1 }}>
                <label className="label">Area Code</label>
                <input className="input" value={areaCode} onChange={e => setAreaCode(e.target.value.replace(/\D/g, '').slice(0, 3))} placeholder="915" maxLength={3} />
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button className="btn btn-primary" onClick={provision} disabled={provisioning}>
                  {provisioning ? <><span className="spinner" />Provisioning...</> : 'Get Number'}
                </button>
              </div>
            </div>
            {provMsg && <div style={{ padding: '8px 12px', borderRadius: 7, fontSize: 12, background: provMsg.startsWith('✅') ? 'var(--green-dim)' : 'var(--red-dim)', color: provMsg.startsWith('✅') ? 'var(--green)' : 'var(--red)' }}>{provMsg}</div>}
            <p style={{ fontSize: 10, color: 'var(--text-4)', letterSpacing: '0.02em' }}>Provisions a local Twilio number (~$1/mo) and auto-configures all webhooks</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Setup

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Setup({ tenant, reload }) {
  const [areaCode, setAreaCode] = useState('')
  const [provisioning, setProvisioning] = useState(false)
  const [provisionMsg, setProvisionMsg] = useState('')

  const [bizName, setBizName] = useState(tenant?.name || '')
  const [bizType, setBizType] = useState(tenant?.business_type || '')
  const [dispatchPhone, setDispatchPhone] = useState(tenant?.dispatch_phone || '')
  const [aiPrompt, setAiPrompt] = useState(tenant?.ai_system_prompt || '')
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  const steps = [
    { key: 'account', label: 'Account Created', done: true },
    { key: 'profile', label: 'Business Profile', done: !!(tenant?.name && tenant?.business_type) },
    { key: 'phone', label: 'AI Phone Number', done: !!tenant?.twilio_number },
    { key: 'dispatch', label: 'Dispatch Phone Set', done: !!tenant?.dispatch_phone },
  ]

  const completedSteps = steps.filter(s => s.done).length
  const progress = Math.round((completedSteps / steps.length) * 100)

  async function handleProvision() {
    if (!areaCode || !/^\d{3}$/.test(areaCode)) {
      setProvisionMsg('Please enter a valid 3-digit area code')
      return
    }
    setProvisioning(true)
    setProvisionMsg('')
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch('https://nosnibbbggmlzavfylcd.supabase.co/functions/v1/provision-number', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ tenant_id: tenant.id, area_code: areaCode })
      })
      const data = await res.json()
      if (data.success) {
        setProvisionMsg(`✅ Number provisioned: ${data.phone_number}`)
        reload()
      } else {
        setProvisionMsg(`❌ ${data.error || 'Failed to provision number'}`)
      }
    } catch (err) {
      setProvisionMsg(`❌ ${err.message}`)
    }
    setProvisioning(false)
  }

  async function handleSaveProfile() {
    setSaving(true)
    setSaveMsg('')
    const { error } = await supabase
      .from('tenants')
      .update({
        name: bizName,
        business_type: bizType,
        dispatch_phone: dispatchPhone,
        ai_system_prompt: aiPrompt,
      })
      .eq('id', tenant.id)

    if (error) {
      setSaveMsg(`❌ ${error.message}`)
    } else {
      setSaveMsg('✅ Profile saved!')
      reload()
    }
    setSaving(false)
  }

  if (!tenant) return (
    <div style={{ padding: 32 }}>
      <div className="card">
        <p style={{ color: 'var(--text-3)', fontSize: 13 }}>No tenant found. Please contact support.</p>
      </div>
    </div>
  )

  return (
    <div style={{ padding: 32, maxWidth: 700 }} className="fade-in">
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em' }}>Setup</h1>
        <p style={{ color: 'var(--text-3)', fontSize: 13, marginTop: 2 }}>Configure your AI receptionist</p>
      </div>

      {/* Progress */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>Setup Progress</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: progress === 100 ? 'var(--green)' : 'var(--accent-2)' }}>{progress}%</span>
        </div>
        <div style={{ height: 4, background: 'var(--bg-4)', borderRadius: 99, overflow: 'hidden', marginBottom: 16 }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: progress === 100 ? 'var(--green)' : 'var(--accent)',
            borderRadius: 99,
            transition: 'width 0.3s ease',
          }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {steps.map(step => (
            <div key={step.key} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                background: step.done ? 'var(--green-dim)' : 'var(--bg-4)',
                border: `1px solid ${step.done ? 'var(--green)' : 'var(--border)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {step.done && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
              </div>
              <span style={{ fontSize: 13, color: step.done ? 'var(--text)' : 'var(--text-3)' }}>{step.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Business Profile */}
      <div className="card" style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Business Profile</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label className="label">Business Name</label>
            <input className="input" value={bizName} onChange={e => setBizName(e.target.value)} placeholder="ABC Plumbing" />
          </div>
          <div>
            <label className="label">Business Type</label>
            <select className="input" value={bizType} onChange={e => setBizType(e.target.value)} style={{ cursor: 'pointer' }}>
              <option value="">Select type...</option>
              {['plumbing', 'hvac', 'electrical', 'roofing', 'landscaping', 'remodeling', 'handyman', 'painting', 'flooring', 'pest control', 'cleaning', 'general contractor'].map(t => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Dispatch Phone (receives SMS alerts)</label>
            <input className="input" value={dispatchPhone} onChange={e => setDispatchPhone(e.target.value)} placeholder="+19151234567" />
          </div>
          <div>
            <label className="label">Custom AI Instructions (optional)</label>
            <textarea className="input" value={aiPrompt} onChange={e => setAiPrompt(e.target.value)}
              placeholder="e.g. We specialize in emergency plumbing in the El Paso area. We're available Mon-Fri 7am-6pm and emergency calls 24/7."
              rows={4} style={{ resize: 'vertical' }}
            />
            <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 5 }}>The AI will use this context when talking to customers</p>
          </div>
          {saveMsg && (
            <div style={{
              padding: '9px 13px', borderRadius: 8, fontSize: 13,
              background: saveMsg.startsWith('✅') ? 'var(--green-dim)' : 'var(--red-dim)',
              color: saveMsg.startsWith('✅') ? 'var(--green)' : 'var(--red)',
            }}>{saveMsg}</div>
          )}
          <button className="btn btn-primary" onClick={handleSaveProfile} disabled={saving} style={{ alignSelf: 'flex-start' }}>
            {saving ? <><span className="spinner" />Saving...</> : 'Save Profile'}
          </button>
        </div>
      </div>

      {/* Phone Number */}
      <div className="card">
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>AI Phone Number</h3>
        <p style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 16 }}>Get a dedicated local number for your AI receptionist</p>

        {tenant.twilio_number ? (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '12px 16px',
            background: 'var(--green-dim)',
            borderRadius: 8,
            border: '1px solid rgba(16,185,129,0.2)',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--green)' }}>Number Active</div>
              <div style={{ fontSize: 12, color: 'var(--text-2)', fontFamily: 'var(--font-mono)' }}>{tenant.twilio_number}</div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ flex: 1 }}>
                <label className="label">Area Code</label>
                <input
                  className="input"
                  value={areaCode}
                  onChange={e => setAreaCode(e.target.value.replace(/\D/g, '').slice(0, 3))}
                  placeholder="915"
                  maxLength={3}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button className="btn btn-primary" onClick={handleProvision} disabled={provisioning}>
                  {provisioning ? <><span className="spinner" />Provisioning...</> : 'Get Number'}
                </button>
              </div>
            </div>
            {provisionMsg && (
              <div style={{
                padding: '9px 13px', borderRadius: 8, fontSize: 13,
                background: provisionMsg.startsWith('✅') ? 'var(--green-dim)' : 'var(--red-dim)',
                color: provisionMsg.startsWith('✅') ? 'var(--green)' : 'var(--red)',
              }}>{provisionMsg}</div>
            )}
            <p style={{ fontSize: 11, color: 'var(--text-3)' }}>This will provision a local Twilio number (~$1/mo) and automatically configure all webhooks</p>
          </div>
        )}
      </div>
    </div>
  )
}

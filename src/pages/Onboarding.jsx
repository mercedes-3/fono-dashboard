import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const BUSINESS_TYPES = [
  'Plumbing', 'HVAC', 'Electrical', 'Roofing', 'Landscaping',
  'Remodeling', 'Handyman', 'Painting', 'Flooring', 'Pest Control',
  'Cleaning', 'General Contractor'
]

function StepIndicator({ current, total }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 48 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: i < current ? 24 : 8,
            height: 8,
            borderRadius: 99,
            background: i < current ? 'var(--platinum)' : i === current ? 'var(--platinum-4)' : 'var(--black-5)',
            border: `1px solid ${i <= current ? 'var(--border-2)' : 'var(--border)'}`,
            transition: 'all 0.3s ease',
          }} />
        </div>
      ))}
      <span style={{ fontSize: 10, color: 'var(--text-4)', letterSpacing: '0.08em', textTransform: 'uppercase', marginLeft: 4 }}>
        Step {current + 1} of {total}
      </span>
    </div>
  )
}

function Field({ label, hint, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: 'block', fontSize: 9, fontWeight: 600, color: 'var(--text-4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>{label}</label>
      {children}
      {hint && <p style={{ fontSize: 10, color: 'var(--text-4)', marginTop: 6, lineHeight: 1.6, letterSpacing: '0.02em' }}>{hint}</p>}
    </div>
  )
}

const inputStyle = {
  width: '100%',
  background: 'var(--black-4)',
  border: '1px solid var(--border-2)',
  borderRadius: 9,
  padding: '11px 14px',
  color: 'var(--text)',
  fontSize: 13,
  outline: 'none',
  fontFamily: 'inherit',
  transition: 'border-color 0.15s, box-shadow 0.15s',
}

// Step 1 — Business Info
function StepOne({ data, onChange, onNext }) {
  const [error, setError] = useState('')

  const next = () => {
    if (!data.bizName) return setError('Business name is required')
    if (!data.bizType) return setError('Please select a business type')
    if (!data.dispatchPhone) return setError('Dispatch phone is required')
    setError('')
    onNext()
  }

  return (
    <div>
      <div style={{ fontSize: 10, color: 'var(--text-4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Getting started</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 300, color: 'var(--text)', letterSpacing: '-0.01em', marginBottom: 6, lineHeight: 1.1 }}>Tell us about your business</h2>
      <p style={{ fontSize: 12, color: 'var(--text-4)', marginBottom: 36, lineHeight: 1.7 }}>Your AI receptionist will use this to greet callers and qualify leads on your behalf.</p>

      <Field label="Business Name">
        <input
          style={inputStyle}
          placeholder="Acme Plumbing Co."
          value={data.bizName}
          onChange={e => onChange({ ...data, bizName: e.target.value })}
          onFocus={e => { e.target.style.borderColor = 'var(--border-3)'; e.target.style.boxShadow = '0 0 0 3px rgba(232,232,232,0.04)' }}
          onBlur={e => { e.target.style.borderColor = 'var(--border-2)'; e.target.style.boxShadow = 'none' }}
        />
      </Field>

      <Field label="Business Type">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {BUSINESS_TYPES.map(t => (
            <button key={t} onClick={() => onChange({ ...data, bizType: t })} style={{
              padding: '9px 10px',
              borderRadius: 8,
              fontSize: 11,
              fontWeight: 400,
              background: data.bizType === t ? 'rgba(232,232,232,0.08)' : 'var(--black-4)',
              color: data.bizType === t ? 'var(--platinum-2)' : 'var(--text-4)',
              border: `1px solid ${data.bizType === t ? 'rgba(232,232,232,0.16)' : 'var(--border)'}`,
              cursor: 'pointer',
              transition: 'all 0.12s',
              textAlign: 'center',
            }}>{t}</button>
          ))}
        </div>
      </Field>

      <Field label="Dispatch Phone" hint="We'll text you instantly when a new lead comes in">
        <input
          style={inputStyle}
          placeholder="+1 (915) 000-0000"
          value={data.dispatchPhone}
          onChange={e => onChange({ ...data, dispatchPhone: e.target.value })}
          onFocus={e => { e.target.style.borderColor = 'var(--border-3)'; e.target.style.boxShadow = '0 0 0 3px rgba(232,232,232,0.04)' }}
          onBlur={e => { e.target.style.borderColor = 'var(--border-2)'; e.target.style.boxShadow = 'none' }}
        />
      </Field>

      {error && <div style={{ padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 12, background: 'var(--red-dim)', color: 'var(--red)', border: '1px solid rgba(248,113,113,0.15)' }}>{error}</div>}

      <button onClick={next} style={{ width: '100%', padding: '12px', borderRadius: 9, fontSize: 13, fontWeight: 500, background: 'var(--platinum)', color: 'var(--black)', border: 'none', cursor: 'pointer', letterSpacing: '0.02em', transition: 'all 0.15s', marginTop: 8 }}>
        Continue →
      </button>
    </div>
  )
}

// Step 2 — Phone Number
function StepTwo({ data, onChange, onNext, onBack, tenantId }) {
  const [provisioning, setProvisioning] = useState(false)
  const [error, setError] = useState('')
  const [provisionedNumber, setProvisionedNumber] = useState('')

  const provision = async () => {
    if (!/^\d{3}$/.test(data.areaCode)) return setError('Enter a valid 3-digit area code')
    setProvisioning(true); setError('')
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch('https://nosnibbbggmlzavfylcd.supabase.co/functions/v1/provision-number', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
        body: JSON.stringify({ tenant_id: tenantId, area_code: data.areaCode })
      })
      const result = await res.json()
      if (result.success) {
        setProvisionedNumber(result.phone_number)
        onChange({ ...data, twilioNumber: result.phone_number })
        setTimeout(() => onNext(), 1200)
      } else {
        setError(result.error || 'Failed to provision number. Try a different area code.')
      }
    } catch (e) {
      setError('Something went wrong. Please try again.')
    }
    setProvisioning(false)
  }

  return (
    <div>
      <div style={{ fontSize: 10, color: 'var(--text-4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Your AI number</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 300, color: 'var(--text)', letterSpacing: '-0.01em', marginBottom: 6, lineHeight: 1.1 }}>Get your dedicated phone number</h2>
      <p style={{ fontSize: 12, color: 'var(--text-4)', marginBottom: 36, lineHeight: 1.7 }}>We'll provision a local number that your AI receptionist answers 24/7. Forward your business line to this number to get started.</p>

      {provisionedNumber ? (
        <div style={{ padding: '24px', background: 'var(--green-dim)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: 12, textAlign: 'center' }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--green)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>Number provisioned</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 28, color: 'var(--text)', letterSpacing: '0.04em' }}>{provisionedNumber}</div>
          <div style={{ fontSize: 11, color: 'var(--text-4)', marginTop: 8 }}>Setting up your dashboard...</div>
        </div>
      ) : (
        <>
          <Field label="Area Code" hint="Enter a 3-digit US area code for your local number (e.g. 915 for El Paso)">
            <div style={{ display: 'flex', gap: 10 }}>
              <input
                style={{ ...inputStyle, fontFamily: 'var(--font-mono)', fontSize: 20, letterSpacing: '0.1em', textAlign: 'center', maxWidth: 120 }}
                placeholder="915"
                maxLength={3}
                value={data.areaCode}
                onChange={e => onChange({ ...data, areaCode: e.target.value.replace(/\D/g, '').slice(0, 3) })}
                onFocus={e => { e.target.style.borderColor = 'var(--border-3)'; e.target.style.boxShadow = '0 0 0 3px rgba(232,232,232,0.04)' }}
                onBlur={e => { e.target.style.borderColor = 'var(--border-2)'; e.target.style.boxShadow = 'none' }}
              />
              <button onClick={provision} disabled={provisioning || data.areaCode.length !== 3} style={{
                flex: 1, padding: '11px 20px', borderRadius: 9, fontSize: 12, fontWeight: 500,
                background: data.areaCode.length === 3 ? 'var(--platinum)' : 'var(--black-5)',
                color: data.areaCode.length === 3 ? 'var(--black)' : 'var(--text-4)',
                border: 'none', cursor: data.areaCode.length === 3 ? 'pointer' : 'not-allowed',
                letterSpacing: '0.02em', transition: 'all 0.15s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}>
                {provisioning ? <><span className="spinner" style={{ borderTopColor: data.areaCode.length === 3 ? 'var(--black)' : 'var(--text-4)' }} /> Provisioning...</> : 'Get My Number'}
              </button>
            </div>
          </Field>

          {error && <div style={{ padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 12, background: 'var(--red-dim)', color: 'var(--red)', border: '1px solid rgba(248,113,113,0.15)' }}>{error}</div>}

          <div style={{ padding: '14px 16px', background: 'var(--black-4)', border: '1px solid var(--border)', borderRadius: 9, marginTop: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-4)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>How it works</div>
            <div style={{ fontSize: 11, color: 'var(--text-4)', lineHeight: 1.8 }}>
              Once provisioned, forward your existing business number to this new AI number. Your AI receptionist will answer every call and qualify every lead automatically.
            </div>
          </div>
        </>
      )}

      <button onClick={onBack} style={{ width: '100%', marginTop: 12, padding: '11px', borderRadius: 9, fontSize: 12, fontWeight: 400, background: 'transparent', color: 'var(--text-4)', border: '1px solid var(--border)', cursor: 'pointer', letterSpacing: '0.02em' }}>
        ← Back
      </button>
    </div>
  )
}

// Step 3 — Done
function StepThree({ data, onFinish }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 40, marginBottom: 20 }}>🎉</div>
      <div style={{ fontSize: 10, color: 'var(--text-4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>You're live</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 300, color: 'var(--text)', letterSpacing: '-0.01em', marginBottom: 16, lineHeight: 1.1 }}>Your AI receptionist is ready</h2>
      <p style={{ fontSize: 12, color: 'var(--text-4)', marginBottom: 36, lineHeight: 1.8, maxWidth: 360, margin: '0 auto 36px' }}>
        Forward your business number to your new AI line and start capturing every lead — 24 hours a day, 7 days a week.
      </p>

      {data.twilioNumber && (
        <div style={{ padding: '20px 24px', background: 'var(--black-4)', border: '1px solid var(--border-2)', borderRadius: 12, marginBottom: 28, display: 'inline-block' }}>
          <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--text-4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Your AI number</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 24, color: 'var(--platinum)', letterSpacing: '0.06em' }}>{data.twilioNumber}</div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32, textAlign: 'left', maxWidth: 360, margin: '0 auto 32px' }}>
        {[
          ['Forward your calls', `Set your existing business number to forward to ${data.twilioNumber || 'your new AI number'}`],
          ['Watch leads arrive', 'Every call gets qualified, every appointment gets booked — automatically'],
          ['Customize anytime', 'Update your AI instructions, business hours, and more from your dashboard'],
        ].map(([title, desc], i) => (
          <div key={i} style={{ display: 'flex', gap: 14, padding: '14px 16px', background: 'var(--black-3)', border: '1px solid var(--border)', borderRadius: 9 }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--accent-dim)', border: '1px solid var(--border-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--platinum-3)' }}>{i + 1}</div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)', marginBottom: 3 }}>{title}</div>
              <div style={{ fontSize: 11, color: 'var(--text-4)', lineHeight: 1.6 }}>{desc}</div>
            </div>
          </div>
        ))}
      </div>

      <button onClick={onFinish} style={{ width: '100%', maxWidth: 360, padding: '13px', borderRadius: 9, fontSize: 13, fontWeight: 500, background: 'var(--platinum)', color: 'var(--black)', border: 'none', cursor: 'pointer', letterSpacing: '0.02em', transition: 'all 0.15s' }}>
        Go to Dashboard →
      </button>
    </div>
  )
}

// Main Onboarding Component
export default function Onboarding() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [tenantId, setTenantId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [data, setData] = useState({
    bizName: '',
    bizType: '',
    dispatchPhone: '',
    areaCode: '',
    twilioNumber: '',
  })

  const formatPhone = (p) => {
    const c = p.replace(/\D/g, '')
    if (c.length === 10) return `+1${c}`
    if (c.length === 11 && c.startsWith('1')) return `+${c}`
    return p
  }

  const handleStepOneNext = async () => {
    setSaving(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { navigate('/auth'); return }

      // Check if tenant already exists
      const { data: existing } = await supabase
        .from('tenant_members')
        .select('tenant_id')
        .eq('user_id', session.user.id)
        .single()

      if (existing?.tenant_id) {
        // Update existing tenant
        await supabase.from('tenants').update({
          name: data.bizName,
          business_type: data.bizType.toLowerCase(),
          dispatch_phone: formatPhone(data.dispatchPhone),
        }).eq('id', existing.tenant_id)
        setTenantId(existing.tenant_id)
      } else {
        // Create new tenant
        const res = await fetch('https://nosnibbbggmlzavfylcd.supabase.co/functions/v1/create-tenant', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
          body: JSON.stringify({ name: data.bizName, dispatch_phone: formatPhone(data.dispatchPhone), business_type: data.bizType.toLowerCase(), pilot_mode: true })
        })
        const result = await res.json()
        if (result.tenant_id) setTenantId(result.tenant_id)
      }
      setStep(1)
    } catch (e) {
      console.error(e)
    }
    setSaving(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative', overflow: 'hidden' }}>
      {/* Ambient */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(232,232,232,0.03) 0%, transparent 70%)' }} />

      <div style={{ width: '100%', maxWidth: 520, position: 'relative' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 48 }}>
          <div style={{ width: 28, height: 28, background: 'var(--platinum)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--black)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.91a16 16 0 006.09 6.09l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
            </svg>
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 500, color: 'var(--platinum)', letterSpacing: '0.04em' }}>fono</span>
        </div>

        <StepIndicator current={step} total={3} />

        {/* Card */}
        <div style={{ background: 'var(--black-3)', border: '1px solid var(--border-2)', borderRadius: 16, padding: '36px', boxShadow: '0 4px 40px rgba(0,0,0,0.5)' }}>
          {step === 0 && <StepOne data={data} onChange={setData} onNext={handleStepOneNext} saving={saving} />}
          {step === 1 && <StepTwo data={data} onChange={setData} onNext={() => setStep(2)} onBack={() => setStep(0)} tenantId={tenantId} />}
          {step === 2 && <StepThree data={data} onFinish={() => navigate('/dashboard')} />}
        </div>
      </div>
    </div>
  )
}

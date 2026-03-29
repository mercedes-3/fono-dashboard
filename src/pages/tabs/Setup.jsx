import { useState } from 'react'
import { supabase } from '../../lib/supabase'

function PageTitle({ title, sub }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ fontSize: 10, color: 'var(--text-4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Fono</div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 300, color: 'var(--text)', letterSpacing: '-0.01em', lineHeight: 1 }}>{title}</h1>
      {sub && <p style={{ fontSize: 11, color: 'var(--text-4)', marginTop: 8, letterSpacing: '0.02em' }}>{sub}</p>}
    </div>
  )
}

function Section({ title, sub, children }) {
  return (
    <div style={{ background: 'var(--black-3)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', marginBottom: 14 }}>
      <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 300, color: 'var(--text)', marginBottom: sub ? 4 : 0 }}>{title}</div>
        {sub && <div style={{ fontSize: 11, color: 'var(--text-4)', letterSpacing: '0.02em' }}>{sub}</div>}
      </div>
      <div style={{ padding: '24px' }}>{children}</div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 9, fontWeight: 600, color: 'var(--text-4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>{label}</label>
      {children}
    </div>
  )
}

const inputStyle = {
  width: '100%', background: 'var(--black-4)', border: '1px solid var(--border-2)',
  borderRadius: 8, padding: '9px 12px', color: 'var(--text)', fontSize: 13,
  outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.15s',
}

export default function Setup({ tenant, reload }) {
  const [bizName, setBizName] = useState(tenant?.name || '')
  const [bizType, setBizType] = useState(tenant?.business_type || '')
  const [dispatch, setDispatch] = useState(tenant?.dispatch_phone || '')
  const [prompt, setPrompt] = useState(tenant?.ai_system_prompt || '')
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [areaCode, setAreaCode] = useState('')
  const [provisioning, setProvisioning] = useState(false)
  const [provMsg, setProvMsg] = useState('')

  const steps = [
    { label: 'Account Created', done: true },
    { label: 'Business Profile', done: !!(tenant?.name && tenant?.business_type) },
    { label: 'AI Phone Number', done: !!tenant?.twilio_number },
    { label: 'Dispatch Phone Set', done: !!tenant?.dispatch_phone },
  ]
  const progress = Math.round((steps.filter(s => s.done).length / steps.length) * 100)

  async function save() {
    setSaving(true); setSaveMsg('')
    const { error } = await supabase.from('tenants').update({ name: bizName, business_type: bizType, dispatch_phone: dispatch, ai_system_prompt: prompt }).eq('id', tenant.id)
    if (error) setSaveMsg(`❌ ${error.message}`)
    else { setSaveMsg('✅ Saved'); reload() }
    setSaving(false)
  }

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

  if (!tenant) return <div style={{ padding: 40 }}><div style={{ color: 'var(--text-4)', fontSize: 12 }}>No tenant found.</div></div>

  return (
    <div style={{ padding: 40, maxWidth: 640 }}>
      <PageTitle title="Setup" sub="Configure your AI receptionist" />

      {/* Progress */}
      <Section title="Setup Progress">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 11, color: 'var(--text-4)' }}>Completion</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 300, color: progress === 100 ? 'var(--green)' : 'var(--platinum)' }}>{progress}%</span>
        </div>
        <div style={{ height: 2, background: 'var(--black-5)', borderRadius: 99, overflow: 'hidden', marginBottom: 20 }}>
          <div style={{ height: '100%', width: `${progress}%`, background: progress === 100 ? 'var(--green)' : 'var(--platinum)', borderRadius: 99, transition: 'width 0.5s ease' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {steps.map(s => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 18, height: 18, borderRadius: '50%', flexShrink: 0, background: s.done ? 'var(--green-dim)' : 'var(--black-5)', border: `1px solid ${s.done ? 'rgba(74,222,128,0.3)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {s.done && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
              </div>
              <span style={{ fontSize: 12, color: s.done ? 'var(--text)' : 'var(--text-4)' }}>{s.label}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Business Profile */}
      <Section title="Business Profile" sub="Your AI receptionist uses this to greet and assist callers">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Field label="Business Name">
            <input style={inputStyle} value={bizName} onChange={e => setBizName(e.target.value)} placeholder="Acme Plumbing" />
          </Field>
          <Field label="Business Type">
            <select style={{ ...inputStyle, cursor: 'pointer' }} value={bizType} onChange={e => setBizType(e.target.value)}>
              <option value="">Select type...</option>
              {['plumbing','hvac','electrical','roofing','landscaping','remodeling','handyman','painting','flooring','pest control','cleaning','general contractor'].map(t => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
          </Field>
          <Field label="Dispatch Phone">
            <input style={inputStyle} value={dispatch} onChange={e => setDispatch(e.target.value)} placeholder="+19151234567" />
          </Field>
          <Field label="Custom AI Instructions">
            <textarea style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="e.g. We specialize in emergency plumbing in El Paso. Available Mon-Fri 7am-6pm, emergency calls 24/7." rows={4} />
          </Field>

          {saveMsg && (
            <div style={{ padding: '8px 12px', borderRadius: 7, fontSize: 12, background: saveMsg.startsWith('✅') ? 'var(--green-dim)' : 'var(--red-dim)', color: saveMsg.startsWith('✅') ? 'var(--green)' : 'var(--red)', border: `1px solid ${saveMsg.startsWith('✅') ? 'rgba(74,222,128,0.15)' : 'rgba(248,113,113,0.15)'}` }}>
              {saveMsg}
            </div>
          )}

          <button onClick={save} disabled={saving} style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 6, padding: '9px 20px', borderRadius: 8, fontSize: 11, fontWeight: 500, background: 'var(--platinum)', color: 'var(--black)', border: 'none', cursor: 'pointer', transition: 'all 0.15s', letterSpacing: '0.04em', opacity: saving ? 0.6 : 1 }}>
            {saving ? <><span className="spinner" style={{ borderTopColor: 'var(--black)' }} /> Saving...</> : 'Save Profile'}
          </button>
        </div>
      </Section>

      {/* Phone Number */}
      <Section title="AI Phone Number" sub="A dedicated local number that routes all calls through your AI receptionist">
        {tenant.twilio_number
          ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', background: 'var(--green-dim)', borderRadius: 9, border: '1px solid rgba(74,222,128,0.15)' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--green)', flexShrink: 0 }} className="dot-live" />
              <div>
                <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--green)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Active</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--text)', letterSpacing: '0.04em' }}>{tenant.twilio_number}</div>
              </div>
            </div>
          )
          : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
                <Field label="Area Code">
                  <input style={{ ...inputStyle, width: 100 }} value={areaCode} onChange={e => setAreaCode(e.target.value.replace(/\D/g, '').slice(0, 3))} placeholder="915" maxLength={3} />
                </Field>
                <button onClick={provision} disabled={provisioning} style={{ padding: '9px 20px', borderRadius: 8, fontSize: 11, fontWeight: 500, background: 'var(--platinum)', color: 'var(--black)', border: 'none', cursor: 'pointer', letterSpacing: '0.04em', opacity: provisioning ? 0.6 : 1, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 1 }}>
                  {provisioning ? <><span className="spinner" style={{ borderTopColor: 'var(--black)' }} /> Provisioning...</> : 'Get Number'}
                </button>
              </div>
              {provMsg && (
                <div style={{ padding: '8px 12px', borderRadius: 7, fontSize: 12, background: provMsg.startsWith('✅') ? 'var(--green-dim)' : 'var(--red-dim)', color: provMsg.startsWith('✅') ? 'var(--green)' : 'var(--red)', border: `1px solid ${provMsg.startsWith('✅') ? 'rgba(74,222,128,0.15)' : 'rgba(248,113,113,0.15)'}` }}>
                  {provMsg}
                </div>
              )}
              <p style={{ fontSize: 10, color: 'var(--text-4)', lineHeight: 1.6, letterSpacing: '0.02em' }}>Provisions a local Twilio number (~$1/mo) and automatically configures all webhooks</p>
            </div>
          )
        }
      </Section>
      {/* Meta / Facebook */}
<Section title="Facebook Lead Ads" sub="Connect your Facebook page to sync leads automatically">
  {tenant.meta_connected ? (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', background: 'var(--green-dim)', borderRadius: 9, border: '1px solid rgba(74,222,128,0.15)' }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--green)', flexShrink: 0 }} className="dot-live" />
      <div>
        <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--green)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Connected</div>
        <div style={{ fontSize: 12, color: 'var(--text)' }}>Facebook page linked · leads sync automatically</div>
      </div>
    </div>
  ) : (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ padding: '14px 16px', background: 'var(--black-4)', border: '1px solid var(--border)', borderRadius: 9 }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-4)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>How it works</div>
        <div style={{ fontSize: 11, color: 'var(--text-4)', lineHeight: 1.8 }}>
          Connect your Facebook Business Page and every lead from your Facebook ads will instantly appear in Fono — with automatic AI SMS follow-up within seconds.
        </div>
      </div>
      
       href={`https://www.facebook.com/v18.0/dialog/oauth?client_id=placeholder&redirect_uri=${encodeURIComponent(window.location.origin + '/meta-callback')}&scope=pages_manage_metadata,pages_read_engagement,leads_retrieval,ads_management&state=${tenant?.id}`}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 8, fontSize: 12, fontWeight: 500, background: '#1877F2', color: 'white', textDecoration: 'none', letterSpacing: '0.02em', alignSelf: 'flex-start' }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
        Connect Facebook Page
      </a>
      <p style={{ fontSize: 10, color: 'var(--text-4)', lineHeight: 1.6, letterSpacing: '0.02em' }}>
        You will need a Facebook Business Page with at least one active Lead Ad form.
      </p>
    </div>
  )}
</Section>
    </div>
  )
}

import { useState } from 'react'

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

const inputStyle = {
  width: '100%', background: 'var(--black-4)', border: '1px solid var(--border-2)',
  borderRadius: 8, padding: '9px 12px', color: 'var(--text)', fontSize: 13,
  outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.15s',
}

export default function Settings({ tenant, user }) {
  const [color, setColor] = useState('#e8e8e8')
  const [greeting, setGreeting] = useState(`Hi! I'm the AI receptionist for ${tenant?.name || 'us'}. How can I help?`)
  const [copied, setCopied] = useState(false)

  const snippet = tenant ? `<script 
  src="https://nosnibbbggmlzavfylcd.supabase.co/storage/v1/object/public/public-assets/widget.js"
  data-tenant="${tenant.id}"
  data-color="${color}"
  data-name="${tenant.name || 'AI Receptionist'}"
  data-phone="${tenant.twilio_number || ''}"
  data-greeting="${greeting}"
></script>` : ''

  const copy = () => {
    navigator.clipboard.writeText(snippet)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const ACCOUNT_FIELDS = [
    ['Email', user?.email, true],
    ['Business', tenant?.name, false],
    ['Type', tenant?.business_type, false],
    ['AI Number', tenant?.twilio_number || 'Not set', true],
    ['Dispatch', tenant?.dispatch_phone || 'Not set', true],
    ['Status', tenant?.pilot_mode ? 'Pilot Mode' : 'Active', false],
  ]

  return (
    <div style={{ padding: 40, maxWidth: 640 }}>
      <PageTitle title="Settings" sub="Account information and widget configuration" />

      <Section title="Account">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {ACCOUNT_FIELDS.map(([label, value, mono]) => (
            <div key={label}>
              <div style={{ fontSize: 9, color: 'var(--text-4)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>{label}</div>
              <div style={{ fontSize: 12, color: 'var(--text)', fontFamily: mono ? 'var(--font-mono)' : 'inherit', letterSpacing: mono ? '0.02em' : 'inherit' }}>{value || '—'}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Website Chat Widget" sub="One line of code — embed AI chat on any website">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 9, fontWeight: 600, color: 'var(--text-4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Brand Color</label>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <input type="color" value={color} onChange={e => setColor(e.target.value)} style={{ width: 34, height: 34, padding: 3, background: 'var(--black-4)', border: '1px solid var(--border-2)', borderRadius: 8, cursor: 'pointer' }} />
              <input style={{ ...inputStyle, fontFamily: 'var(--font-mono)', fontSize: 12 }} value={color} onChange={e => setColor(e.target.value)} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 9, fontWeight: 600, color: 'var(--text-4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Greeting Message</label>
            <input style={inputStyle} value={greeting} onChange={e => setGreeting(e.target.value)} />
          </div>

          {/* Preview */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'var(--black-4)', borderRadius: 9, border: '1px solid var(--border)' }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M20 2H4a2 2 0 00-2 2v18l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2z"/></svg>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text)', marginBottom: 2 }}>{tenant?.name || 'AI Receptionist'}</div>
              <div style={{ fontSize: 10, color: 'var(--text-4)' }}>{greeting.slice(0, 52)}{greeting.length > 52 ? '...' : ''}</div>
            </div>
          </div>

          {/* Code block */}
          <div style={{ background: 'var(--black)', border: '1px solid var(--border)', borderRadius: 9, padding: '16px 18px' }}>
            <pre style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-4)', whiteSpace: 'pre-wrap', wordBreak: 'break-all', lineHeight: 1.8, margin: 0 }}>{snippet}</pre>
          </div>

          <button onClick={copy} style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 6, padding: '9px 20px', borderRadius: 8, fontSize: 11, fontWeight: 500, background: copied ? 'var(--green-dim)' : 'var(--platinum)', color: copied ? 'var(--green)' : 'var(--black)', border: copied ? '1px solid rgba(74,222,128,0.15)' : 'none', cursor: 'pointer', transition: 'all 0.15s', letterSpacing: '0.04em' }}>
            {copied
              ? <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Copied!</>
              : <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>Copy Snippet</>
            }
          </button>

          <p style={{ fontSize: 10, color: 'var(--text-4)', lineHeight: 1.7, letterSpacing: '0.02em' }}>
            Paste before the closing &lt;/body&gt; tag. Works with WordPress, Wix, Squarespace, Webflow, and any HTML site.
          </p>
        </div>
      </Section>
    </div>
  )
}

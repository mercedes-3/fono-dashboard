import { useState } from 'react'
import PageHeader from '../../components/PageHeader'

export default function Settings({ tenant, user, reload }) {
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

  return (
    <div style={{ padding: 40, maxWidth: 680 }} className="fade-up">
      <PageHeader title="Settings" sub="Account and widget configuration" />

      {/* Account */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 400, color: 'var(--text)', marginBottom: 18 }}>Account</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {[
            ['Email', user?.email],
            ['Business', tenant?.name],
            ['Type', tenant?.business_type],
            ['AI Number', tenant?.twilio_number || 'Not set'],
            ['Dispatch', tenant?.dispatch_phone || 'Not set'],
            ['Status', tenant?.pilot_mode ? 'Pilot Mode' : 'Active'],
          ].map(([label, value]) => (
            <div key={label}>
              <div style={{ fontSize: 9, color: 'var(--text-4)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 5 }}>{label}</div>
              <div style={{ fontSize: 12, color: 'var(--text)', fontFamily: label === 'Email' || label === 'AI Number' || label === 'Dispatch' ? 'var(--font-mono)' : 'inherit' }}>
                {value || '—'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Widget */}
      <div className="card">
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 400, color: 'var(--text)', marginBottom: 6 }}>Website Chat Widget</div>
        <p style={{ fontSize: 11, color: 'var(--text-4)', marginBottom: 20 }}>Embed an AI chat widget on any website — paste one line of code</p>

        <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
          <div style={{ flex: 1 }}>
            <label className="label">Brand Color</label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input type="color" value={color} onChange={e => setColor(e.target.value)}
                style={{ width: 32, height: 32, padding: 2, background: 'var(--black-4)', border: '1px solid var(--border-2)', borderRadius: 6, cursor: 'pointer' }} />
              <input className="input" value={color} onChange={e => setColor(e.target.value)} style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }} />
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label className="label">Greeting Message</label>
          <input className="input" value={greeting} onChange={e => setGreeting(e.target.value)} />
        </div>

        {/* Preview bubble */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: 'var(--black-4)', borderRadius: 8, marginBottom: 16, border: '1px solid var(--border)' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M20 2H4a2 2 0 00-2 2v18l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2z"/></svg>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text)' }}>{tenant?.name || 'AI Receptionist'}</div>
            <div style={{ fontSize: 10, color: 'var(--text-4)' }}>{greeting.slice(0, 48)}{greeting.length > 48 ? '...' : ''}</div>
          </div>
        </div>

        {/* Code */}
        <div style={{ background: 'var(--black)', border: '1px solid var(--border)', borderRadius: 8, padding: '14px 16px', marginBottom: 12 }}>
          <pre style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-3)', whiteSpace: 'pre-wrap', wordBreak: 'break-all', lineHeight: 1.7 }}>{snippet}</pre>
        </div>

        <button className="btn btn-primary" onClick={copy}>
          {copied
            ? <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Copied!</>
            : <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>Copy Snippet</>
          }
        </button>

        <p style={{ fontSize: 10, color: 'var(--text-4)', marginTop: 10, lineHeight: 1.6 }}>
          Paste before the closing &lt;/body&gt; tag on any website. Works with WordPress, Wix, Squarespace, Webflow, and any HTML site.
        </p>
      </div>
    </div>
  )
}

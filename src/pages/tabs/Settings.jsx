import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Settings({ tenant, user, reload }) {
  const [copied, setCopied] = useState(false)
  const [widgetColor, setWidgetColor] = useState('#3b82f6')
  const [widgetGreeting, setWidgetGreeting] = useState(`Hi! I'm the AI receptionist for ${tenant?.name || 'us'}. How can I help?`)

  const widgetSnippet = tenant ? `<script 
  src="https://nosnibbbggmlzavfylcd.supabase.co/storage/v1/object/public/public-assets/widget.js"
  data-tenant="${tenant.id}"
  data-color="${widgetColor}"
  data-name="${tenant.name || 'AI Receptionist'}"
  data-phone="${tenant.twilio_number || ''}"
  data-greeting="${widgetGreeting}"
></script>` : ''

  const copySnippet = () => {
    navigator.clipboard.writeText(widgetSnippet)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ padding: 32, maxWidth: 700 }} className="fade-in">
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em' }}>Settings</h1>
        <p style={{ color: 'var(--text-3)', fontSize: 13, marginTop: 2 }}>Account and widget configuration</p>
      </div>

      {/* Account */}
      <div className="card" style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Account</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            ['Email', user?.email],
            ['Business', tenant?.name],
            ['Business Type', tenant?.business_type],
            ['AI Number', tenant?.twilio_number || 'Not set'],
            ['Dispatch Phone', tenant?.dispatch_phone || 'Not set'],
            ['Pilot Mode', tenant?.pilot_mode ? 'Enabled' : 'Disabled'],
          ].map(([label, value]) => (
            <div key={label}>
              <div style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 500, letterSpacing: '0.03em', textTransform: 'uppercase', marginBottom: 3 }}>{label}</div>
              <div style={{ fontSize: 13, color: 'var(--text)', fontFamily: label === 'Email' || label === 'AI Number' || label === 'Dispatch Phone' ? 'var(--font-mono)' : 'inherit' }}>
                {value || '—'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Widget */}
      <div className="card">
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Website Chat Widget</h3>
        <p style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 16 }}>Embed this on your contractor's website to enable AI chat</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label className="label">Brand Color</label>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input type="color" value={widgetColor} onChange={e => setWidgetColor(e.target.value)}
                  style={{ width: 36, height: 36, padding: 2, background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: 6, cursor: 'pointer' }}
                />
                <input className="input" value={widgetColor} onChange={e => setWidgetColor(e.target.value)} style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }} />
              </div>
            </div>
          </div>
          <div>
            <label className="label">Greeting Message</label>
            <input className="input" value={widgetGreeting} onChange={e => setWidgetGreeting(e.target.value)} />
          </div>
        </div>

        {/* Preview */}
        <div style={{
          padding: '10px 14px',
          background: 'var(--bg-3)',
          borderRadius: 8,
          marginBottom: 14,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: widgetColor,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M20 2H4a2 2 0 00-2 2v18l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2z"/></svg>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600 }}>{tenant?.name || 'AI Receptionist'}</div>
            <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{widgetGreeting.slice(0, 50)}{widgetGreeting.length > 50 ? '...' : ''}</div>
          </div>
        </div>

        {/* Code snippet */}
        <div style={{
          background: 'var(--bg)',
          border: '1px solid var(--border)',
          borderRadius: 8,
          padding: '14px 16px',
          marginBottom: 12,
          position: 'relative',
        }}>
          <pre style={{
            fontSize: 11,
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-2)',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
            lineHeight: 1.6,
          }}>{widgetSnippet}</pre>
        </div>

        <button className="btn btn-primary" onClick={copySnippet} style={{ gap: 8 }}>
          {copied ? (
            <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Copied!</>
          ) : (
            <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>Copy Snippet</>
          )}
        </button>

        <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 10 }}>
          Paste this snippet before the closing &lt;/body&gt; tag on any website. Works with WordPress, Wix, Squarespace, and any HTML site.
        </p>
      </div>
    </div>
  )
}

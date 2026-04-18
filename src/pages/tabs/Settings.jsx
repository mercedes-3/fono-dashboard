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

const inputStyle = {
  width: '100%', background: 'var(--black-4)', border: '1px solid var(--border-2)',
  borderRadius: 8, padding: '9px 12px', color: 'var(--text)', fontSize: 13,
  outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.15s',
}

export default function Settings({ tenant, user }) {
  const [color, setColor] = useState('#e8e8e8')
  const [greeting, setGreeting] = useState(`Hi! I'm the AI receptionist for ${tenant?.name || 'us'}. How can I help?`)
  const [copied, setCopied] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [exportMsg, setExportMsg] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [deleteMsg, setDeleteMsg] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)

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

  async function exportData() {
    if (!tenant?.id) return
    setExporting(true)
    setExportMsg('')
    try {
      const [leads, messages, calls, appointments] = await Promise.all([
        supabase.from('leads').select('*').eq('tenant_id', tenant.id),
        supabase.from('messages').select('*').eq('tenant_id', tenant.id),
        supabase.from('call_logs').select('*').eq('tenant_id', tenant.id),
        supabase.from('appointment_requests').select('*').eq('tenant_id', tenant.id),
      ])

      const exportObj = {
        exported_at: new Date().toISOString(),
        tenant: {
          id: tenant.id,
          name: tenant.name,
          business_type: tenant.business_type,
          dispatch_phone: tenant.dispatch_phone,
          twilio_number: tenant.twilio_number,
        },
        leads: leads.data || [],
        messages: messages.data || [],
        call_logs: calls.data || [],
        appointment_requests: appointments.data || [],
      }

      const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `fono-data-export-${new Date().toISOString().slice(0, 10)}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setExportMsg('Data exported successfully')
      setTimeout(() => setExportMsg(''), 3000)
    } catch (e) {
      setExportMsg(`Export failed: ${e.message}`)
    }
    setExporting(false)
  }

  async function deleteAllData() {
    if (!tenant?.id) return
    setDeleting(true)
    setDeleteMsg('')
    try {
      await supabase.from('messages').delete().eq('tenant_id', tenant.id)
      await supabase.from('appointment_requests').delete().eq('tenant_id', tenant.id)
      await supabase.from('call_logs').delete().eq('tenant_id', tenant.id)
      await supabase.from('leads').delete().eq('tenant_id', tenant.id)

      setDeleteMsg('All customer data has been deleted')
      setConfirmDelete(false)
      setTimeout(() => setDeleteMsg(''), 5000)
    } catch (e) {
      setDeleteMsg(`Delete failed: ${e.message}`)
    }
    setDeleting(false)
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

      <Section title="Data & Privacy" sub="Export or delete your data for GDPR/CCPA compliance">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--text-4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Export Data</div>
            <p style={{ fontSize: 11, color: 'var(--text-4)', lineHeight: 1.6, margin: 0 }}>
              Download all your data including leads, messages, call logs, and appointments as a JSON file.
            </p>
            <button onClick={exportData} disabled={exporting} style={{
              alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 6,
              padding: '9px 20px', borderRadius: 8, fontSize: 11, fontWeight: 500,
              background: 'var(--platinum)', color: 'var(--black)',
              border: 'none', cursor: 'pointer', letterSpacing: '0.04em',
              opacity: exporting ? 0.6 : 1,
            }}>
              {exporting ? (
                <><span className="spinner" style={{ width: 12, height: 12, borderTopColor: 'var(--black)' }} /> Exporting...</>
              ) : (
                <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Export All Data</>
              )}
            </button>
            {exportMsg && (
              <div style={{ fontSize: 11, color: exportMsg.includes('failed') ? 'var(--red)' : 'var(--green)' }}>{exportMsg}</div>
            )}
          </div>

          <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--red)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Delete All Data</div>
            <p style={{ fontSize: 11, color: 'var(--text-4)', lineHeight: 1.6, margin: 0 }}>
              Permanently delete all leads, messages, call logs, and appointments. This action cannot be undone. Your account and settings will remain intact.
            </p>
            {!confirmDelete ? (
              <button onClick={() => setConfirmDelete(true)} style={{
                alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 6,
                padding: '9px 20px', borderRadius: 8, fontSize: 11, fontWeight: 500,
                background: 'transparent', color: 'var(--red)',
                border: '1px solid rgba(248,113,113,0.3)', cursor: 'pointer', letterSpacing: '0.04em',
              }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                Delete All Customer Data
              </button>
            ) : (
              <div style={{ padding: '14px 16px', background: 'var(--red-dim)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 9 }}>
                <div style={{ fontSize: 12, color: 'var(--red)', fontWeight: 500, marginBottom: 8 }}>Are you sure? This cannot be undone.</div>
                <div style={{ fontSize: 11, color: 'var(--text-4)', marginBottom: 14, lineHeight: 1.6 }}>
                  This will permanently delete all leads, messages, call logs, and appointment requests for your account.
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={deleteAllData} disabled={deleting} style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '8px 18px', borderRadius: 8, fontSize: 11, fontWeight: 500,
                    background: 'var(--red)', color: 'white',
                    border: 'none', cursor: 'pointer', letterSpacing: '0.04em',
                    opacity: deleting ? 0.6 : 1,
                  }}>
                    {deleting ? 'Deleting...' : 'Yes, Delete Everything'}
                  </button>
                  <button onClick={() => setConfirmDelete(false)} style={{
                    padding: '8px 18px', borderRadius: 8, fontSize: 11, fontWeight: 500,
                    background: 'transparent', color: 'var(--text-4)',
                    border: '1px solid var(--border)', cursor: 'pointer', letterSpacing: '0.04em',
                  }}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
            {deleteMsg && (
              <div style={{ fontSize: 11, color: deleteMsg.includes('failed') ? 'var(--red)' : 'var(--green)' }}>{deleteMsg}</div>
            )}
          </div>
        </div>
      </Section>
    </div>
  )
}

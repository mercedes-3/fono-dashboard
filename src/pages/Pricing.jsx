import { Link } from 'react-router-dom'
import { useState } from 'react'

const FEATURES = [
  '24/7 AI phone receptionist',
  'Dedicated local phone number',
  'Lead qualification & intake',
  'Social media ads & analytics',
  'Appointment booking',
  'SMS notifications',
  'Live dashboard',
  'Priority support',
]

export default function Pricing() {
  const [agreed, setAgreed] = useState(false)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)', fontFamily: 'var(--font)', color: 'var(--text)' }}>

      {/* Nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 40px', height: 60,
        background: 'rgba(8,8,8,0.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, background: 'var(--platinum)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--black)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.91a16 16 0 006.09 6.09l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
            </svg>
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 500, color: 'var(--platinum)', letterSpacing: '0.04em' }}>fono</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link to="/auth" style={{ fontSize: 12, color: 'var(--text-3)', padding: '7px 14px' }}>Sign In</Link>
          <Link to="/auth" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 16px', borderRadius: 8, fontSize: 12, fontWeight: 500, background: 'var(--platinum)', color: 'var(--black)', textDecoration: 'none' }}>Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '80px 40px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(232,232,232,0.04) 0%, transparent 70%)' }} />
        <div style={{ position: 'relative', maxWidth: 600, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 99, background: 'var(--accent-dim)', border: '1px solid var(--border-2)', fontSize: 10, color: 'var(--platinum-3)', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 28 }}>
            Simple, transparent pricing
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 6vw, 60px)', fontWeight: 300, color: 'var(--text)', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 16 }}>
            One plan.<br />
            <span style={{ fontStyle: 'italic', color: 'var(--platinum-3)' }}>Everything included.</span>
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-3)', lineHeight: 1.7, fontWeight: 300, maxWidth: 420, margin: '0 auto' }}>
            No tiers. No feature gates. No surprises. Just a fully configured AI receptionist that works from day one.
          </p>
        </div>
      </section>

      {/* Pricing Card */}
      <section style={{ padding: '0 40px 80px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 520 }}>

          {/* Main card */}
          <div style={{
            background: 'var(--black-3)',
            border: '1px solid rgba(232,232,232,0.12)',
            borderRadius: 16,
            overflow: 'hidden',
            boxShadow: '0 4px 40px rgba(0,0,0,0.5)',
          }}>
            {/* Header */}
            <div style={{ padding: '32px 36px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Professional Plan</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontStyle: 'italic', color: 'var(--platinum-3)' }}>Full-service AI receptionist</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 99, background: 'var(--green-dim)', border: '1px solid rgba(74,222,128,0.2)', fontSize: 10, color: 'var(--green)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--green)' }} />
                  Active
                </div>
              </div>

              {/* Pricing */}
              <div style={{ display: 'flex', gap: 24, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--text-4)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Monthly</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 52, fontWeight: 300, color: 'var(--text)', lineHeight: 1, letterSpacing: '-0.02em' }}>$750</span>
                    <span style={{ fontSize: 12, color: 'var(--text-4)', letterSpacing: '0.04em' }}>/mo</span>
                  </div>
                </div>
                <div style={{ width: 1, height: 48, background: 'var(--border)' }} />
                <div>
                  <div style={{ fontSize: 10, color: 'var(--text-4)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>One-time setup</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 52, fontWeight: 300, color: 'var(--platinum-3)', lineHeight: 1, letterSpacing: '-0.02em' }}>$3,500</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div style={{ padding: '28px 36px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 18 }}>Everything included</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {FEATURES.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--green-dim)', border: '1px solid rgba(74,222,128,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Guarantee */}
            <div style={{ padding: '20px 36px', borderBottom: '1px solid var(--border)', background: 'rgba(232,232,232,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ fontSize: 18, flexShrink: 0 }}>🛡️</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)', marginBottom: 4 }}>14-Day Satisfaction Guarantee</div>
                  <div style={{ fontSize: 11, color: 'var(--text-4)', lineHeight: 1.7 }}>
                    Cancel within 14 calendar days of service activation for a full refund of the $750 monthly fee. The setup fee is non-refundable once onboarding and configuration begin.
                  </div>
                </div>
              </div>
            </div>

            {/* Agreement + CTA */}
            <div style={{ padding: '28px 36px' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer', marginBottom: 20 }}>
                <div onClick={() => setAgreed(!agreed)} style={{
                  width: 18, height: 18, borderRadius: 4, flexShrink: 0, marginTop: 1,
                  background: agreed ? 'var(--platinum)' : 'var(--black-5)',
                  border: `1px solid ${agreed ? 'var(--platinum)' : 'var(--border-2)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.15s', cursor: 'pointer',
                }}>
                  {agreed && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--black)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                </div>
                <span style={{ fontSize: 11, color: 'var(--text-4)', lineHeight: 1.7 }}>
                  By completing this purchase, I agree to the{' '}
                  <Link to="/terms" style={{ color: 'var(--platinum-3)', textDecoration: 'underline' }}>Terms of Service</Link>
                  {' '}and{' '}
                  <Link to="/refund" style={{ color: 'var(--platinum-3)', textDecoration: 'underline' }}>Refund Policy</Link>.
                  {' '}I acknowledge that the $3,500 setup fee is non-refundable once onboarding and system configuration begin.
                </span>
              </label>

              <a
                href="https://buy.stripe.com/28EdRbfsI5cfbnPfHI7ss05"
                style={{
                  display: 'block', width: '100%', textAlign: 'center',
                  padding: '13px', borderRadius: 9, fontSize: 13, fontWeight: 500,
                  background: agreed ? 'var(--platinum)' : 'var(--black-5)',
                  color: agreed ? 'var(--black)' : 'var(--text-4)',
                  border: `1px solid ${agreed ? 'transparent' : 'var(--border)'}`,
                  transition: 'all 0.2s',
                  pointerEvents: agreed ? 'auto' : 'none',
                  letterSpacing: '0.02em',
                  textDecoration: 'none',
                }}
              >
                Start Capturing Missed Calls
              </a>

              <p style={{ textAlign: 'center', fontSize: 10, color: 'var(--text-4)', marginTop: 10, letterSpacing: '0.04em' }}>
                No demo required · Instant setup · 14-day guarantee
              </p>
            </div>
          </div>

          {/* Below card note */}
          <div style={{ marginTop: 24, padding: '16px 20px', background: 'var(--black-3)', border: '1px solid var(--border)', borderRadius: 10 }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-4)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Refund Policy</div>
            <p style={{ fontSize: 11, color: 'var(--text-4)', lineHeight: 1.7 }}>
              Client may cancel within 14 calendar days of service activation and receive a full refund of the initial $750 monthly service fee. The $3,500 setup fee is non-refundable due to custom system configuration and onboarding.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '24px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 20, height: 20, background: 'var(--platinum)', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="var(--black)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.91a16 16 0 006.09 6.09l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
            </svg>
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--platinum-3)', letterSpacing: '0.04em' }}>fono</span>
        </div>
        <p style={{ fontSize: 10, color: 'var(--text-4)', letterSpacing: '0.04em' }}>© 2026 Fono. All rights reserved.</p>
      </footer>
    </div>
  )
}

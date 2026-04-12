import { Link } from 'react-router-dom'

const FEATURES = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--platinum)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.91a16 16 0 006.09 6.09l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
      </svg>
    ),
    title: 'Always Answers',
    desc: 'Your AI receptionist picks up every call, 24/7. No voicemail. No missed leads. Ever.'
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--platinum)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
      </svg>
    ),
    title: 'SMS Follow-Up',
    desc: 'Qualifies leads over text automatically. Collects name, address, service type, issue, and preferred time.'
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--platinum)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/>
        <path d="M19 10v2a7 7 0 01-14 0v-2"/>
        <line x1="12" y1="19" x2="12" y2="23"/>
        <line x1="8" y1="23" x2="16" y2="23"/>
      </svg>
    ),
    title: 'Natural Voice AI',
    desc: 'Human-sounding voice your customers will trust. They just know they were helped — fast.'
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--platinum)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
    title: 'Books Appointments',
    desc: 'Schedules jobs on the call. You get an instant text with everything — just confirm or decline.'
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--platinum)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
      </svg>
    ),
    title: 'Website Chat',
    desc: 'Embeddable chat widget for your site. One line of code. Fully branded to your business.'
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--platinum)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 20V10"/>
        <path d="M12 20V4"/>
        <path d="M6 20v-6"/>
      </svg>
    ),
    title: 'Live Dashboard',
    desc: 'Every lead, call, and appointment in one place. Real-time notifications. Zero spreadsheets.'
  },
]

const HOW = [
  { step: '01', title: 'Sign up', desc: 'Create your account and set up your business profile in under 5 minutes.' },
  { step: '02', title: 'Get your number', desc: 'We provision a dedicated local phone number for your AI receptionist instantly.' },
  { step: '03', title: 'Forward your calls', desc: 'Set up call forwarding from your business line. The AI handles everything from there.' },
  { step: '04', title: 'Win more jobs', desc: 'Watch leads roll in. Review, confirm, and close — all from your dashboard.' },
]

export default function Landing() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)', fontFamily: 'var(--font)', color: 'var(--text)' }}>

      {/* Nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px',
        height: 60,
        background: 'rgba(8,8,8,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, background: 'var(--platinum)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--black)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.91a16 16 0 006.09 6.09l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
            </svg>
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 500, color: 'var(--platinum)', letterSpacing: '0.04em' }}>fono</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link to="/auth" style={{ fontSize: 12, color: 'var(--text-3)', padding: '7px 14px', textDecoration: 'none' }}>Sign In</Link>
          <Link to="/pricing" style={{
            fontSize: 12, fontWeight: 500, padding: '8px 18px', borderRadius: 8,
            background: 'var(--platinum)', color: 'var(--black)',
            textDecoration: 'none', letterSpacing: '0.02em',
          }}>Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        position: 'relative',
        padding: 'clamp(80px, 12vw, 140px) 24px clamp(60px, 10vw, 100px)',
        textAlign: 'center',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(232,232,232,0.03) 0%, transparent 70%)' }} />

        <div style={{ position: 'relative', maxWidth: 700, margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '5px 14px', borderRadius: 99,
            background: 'rgba(232,232,232,0.04)', border: '1px solid var(--border)',
            fontSize: 10, color: 'var(--text-4)', fontWeight: 500,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            marginBottom: 32,
          }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--green)' }} className="dot-live" />
            AI Receptionist for Contractors
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(40px, 9vw, 76px)',
            fontWeight: 300,
            color: 'var(--text)',
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            marginBottom: 24,
          }}>
            Never miss a lead.<br />
            <span style={{ color: 'var(--platinum-3)', fontStyle: 'italic' }}>Never lose a job.</span>
          </h1>

          <p style={{
            fontSize: 'clamp(14px, 2vw, 16px)', color: 'var(--text-3)',
            lineHeight: 1.7, maxWidth: 460, margin: '0 auto 40px', fontWeight: 300,
          }}>
            Fono answers every call, qualifies every lead, and books appointments automatically — while you're on the job site.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/pricing" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 28px', borderRadius: 9, fontSize: 13, fontWeight: 500,
              background: 'var(--platinum)', color: 'var(--black)',
              textDecoration: 'none', letterSpacing: '0.02em',
              transition: 'opacity 0.15s',
            }}>
              Get Started
            </Link>
            <a href="#demo" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 28px', borderRadius: 9, fontSize: 13, fontWeight: 500,
              background: 'transparent', color: 'var(--text-3)',
              border: '1px solid var(--border-2)',
              textDecoration: 'none', letterSpacing: '0.02em',
              transition: 'all 0.15s',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.91a16 16 0 006.09 6.09l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
              </svg>
              Hear It Live
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '0 24px 80px', maxWidth: 860, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 1, background: 'var(--border)',
          borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)',
        }}>
          {[
            { value: '24/7', label: 'Always Available' },
            { value: '< 1s', label: 'Response Time' },
            { value: '100%', label: 'Calls Answered' },
          ].map(({ value, label }) => (
            <div key={label} style={{ padding: '28px 20px', background: 'var(--black-2)', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 5vw, 36px)', fontWeight: 300, color: 'var(--platinum)', letterSpacing: '-0.02em', marginBottom: 6 }}>{value}</div>
              <div style={{ fontSize: 9, color: 'var(--text-4)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Demo CTA */}
      <section id="demo" style={{ padding: '40px 24px 80px', maxWidth: 560, margin: '0 auto' }}>
        <div style={{
          background: 'var(--black-3)',
          border: '1px solid var(--border)',
          borderRadius: 14,
          padding: 'clamp(28px, 5vw, 40px)',
          textAlign: 'center',
        }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(232,232,232,0.06)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--platinum)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.91a16 16 0 006.09 6.09l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
            </svg>
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 4vw, 28px)', fontWeight: 300, color: 'var(--text)', marginBottom: 8, letterSpacing: '-0.01em' }}>
            Hear it for yourself.
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-4)', lineHeight: 1.7, marginBottom: 24, maxWidth: 360, margin: '0 auto 24px' }}>
            Call our demo line and experience exactly what your customers will hear.
          </p>
          <a href="tel:+19152777385" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '12px 28px', borderRadius: 9, fontSize: 14, fontWeight: 500,
            background: 'var(--platinum)', color: 'var(--black)',
            textDecoration: 'none', letterSpacing: '0.02em',
            fontFamily: 'var(--font-mono)',
          }}>
            (915) 277-7385
          </a>
          <p style={{ fontSize: 10, color: 'var(--text-4)', marginTop: 12, letterSpacing: '0.04em' }}>
            Live demo · Takes 60 seconds
          </p>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '40px 24px 80px', maxWidth: 960, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 9, color: 'var(--text-4)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>Capabilities</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 300, color: 'var(--text)', letterSpacing: '-0.01em' }}>
            Everything your receptionist does,<br />
            <span style={{ fontStyle: 'italic', color: 'var(--platinum-3)' }}>done automatically.</span>
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 1, background: 'var(--border)',
          borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)',
        }}>
          {FEATURES.map(({ icon, title, desc }) => (
            <div key={title} style={{ padding: 'clamp(20px, 3vw, 28px) clamp(18px, 3vw, 24px)', background: 'var(--black-2)' }}>
              <div style={{ marginBottom: 14, opacity: 0.7 }}>{icon}</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 8, letterSpacing: '0.01em' }}>{title}</div>
              <div style={{ fontSize: 12, color: 'var(--text-4)', lineHeight: 1.7 }}>{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" style={{ padding: '40px 24px 80px', maxWidth: 860, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 9, color: 'var(--text-4)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>Process</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 300, color: 'var(--text)', letterSpacing: '-0.01em' }}>Up and running in minutes</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
          {HOW.map(({ step, title, desc }) => (
            <div key={step} style={{
              padding: 'clamp(20px, 3vw, 28px)',
              background: 'var(--black-3)',
              border: '1px solid var(--border)',
              borderRadius: 12,
            }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-4)', letterSpacing: '0.08em', marginBottom: 16 }}>{step}</div>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)', marginBottom: 8 }}>{title}</div>
              <div style={{ fontSize: 12, color: 'var(--text-4)', lineHeight: 1.7 }}>{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Social proof placeholder */}
      <section style={{ padding: '20px 24px 80px', maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
        <div style={{
          padding: 'clamp(24px, 4vw, 36px)',
          background: 'var(--black-3)',
          border: '1px solid var(--border)',
          borderRadius: 14,
        }}>
          <div style={{ fontSize: 20, marginBottom: 12 }}>&ldquo;</div>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(16px, 3vw, 20px)', fontWeight: 300, color: 'var(--text)', lineHeight: 1.6, fontStyle: 'italic', marginBottom: 16 }}>
            I used to miss 5-10 calls a week when I was on a job. Now every single one gets answered. My customers think I hired a receptionist.
          </p>
          <div style={{ fontSize: 11, color: 'var(--text-4)', letterSpacing: '0.04em' }}>
            — Local Contractor, El Paso TX
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '40px 24px 100px', textAlign: 'center' }}>
        <div style={{ maxWidth: 500, margin: '0 auto' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(32px, 6vw, 48px)',
            fontWeight: 300, color: 'var(--text)',
            lineHeight: 1.15, letterSpacing: '-0.02em',
            marginBottom: 16,
          }}>
            Stop letting missed calls<br />
            <span style={{ fontStyle: 'italic', color: 'var(--platinum-3)' }}>cost you money.</span>
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-4)', marginBottom: 32, lineHeight: 1.7 }}>
            Every missed call is a missed job. Fono makes sure that never happens again.
          </p>
          <Link to="/pricing" style={{
            display: 'inline-flex', alignItems: 'center',
            padding: '13px 32px', borderRadius: 9, fontSize: 13, fontWeight: 500,
            background: 'var(--platinum)', color: 'var(--black)',
            textDecoration: 'none', letterSpacing: '0.02em',
          }}>
            Get Started Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 20, height: 20, background: 'var(--platinum)', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="var(--black)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.91a16 16 0 006.09 6.09l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
            </svg>
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--platinum-3)', letterSpacing: '0.04em' }}>fono</span>
        </div>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <Link to="/terms" style={{ fontSize: 10, color: 'var(--text-4)', textDecoration: 'none', letterSpacing: '0.04em' }}>Terms</Link>
          <Link to="/refund" style={{ fontSize: 10, color: 'var(--text-4)', textDecoration: 'none', letterSpacing: '0.04em' }}>Refund Policy</Link>
          <Link to="/pricing" style={{ fontSize: 10, color: 'var(--text-4)', textDecoration: 'none', letterSpacing: '0.04em' }}>Pricing</Link>
        </div>
        <p style={{ fontSize: 10, color: 'var(--text-4)', letterSpacing: '0.04em' }}>© 2026 Fono. All rights reserved.</p>
      </footer>
    </div>
  )
}

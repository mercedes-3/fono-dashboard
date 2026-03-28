import { Link } from 'react-router-dom'

const FEATURES = [
  { icon: '📞', title: 'Always Answers', desc: 'Your AI receptionist picks up every call, 24 hours a day, 7 days a week — no voicemail, no missed leads.' },
  { icon: '💬', title: 'SMS Intake', desc: 'Qualifies leads over text in a natural conversation. Collects name, address, service type, issue, and preferred time.' },
  { icon: '🎙️', title: 'Voice AI', desc: 'Human-sounding voice powered by ElevenLabs. Customers don\'t know it\'s AI — they just know they were helped.' },
  { icon: '📅', title: 'Books Appointments', desc: 'Schedules jobs directly during the call or conversation. Contractor gets an instant SMS to confirm or decline.' },
  { icon: '🌐', title: 'Web Chat Widget', desc: 'Embeddable chat bubble for any website. One line of code. Fully branded to the contractor.' },
  { icon: '📊', title: 'Live Dashboard', desc: 'Every lead, call, and appointment in one place. Real-time notifications. No spreadsheets.' },
]

const STATS = [
  { value: '24/7', label: 'Always available' },
  { value: '< 1s', label: 'Response time' },
  { value: '100%', label: 'Calls answered' },
  { value: '3×', label: 'More bookings' },
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
        padding: '0 40px', height: 60,
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
          <Link to="/auth" style={{ fontSize: 12, color: 'var(--text-3)', padding: '7px 14px', borderRadius: 7, transition: 'color 0.15s' }}>Sign In</Link>
          <Link to="/auth" className="btn btn-primary" style={{ fontSize: 12, padding: '7px 16px' }}>Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        position: 'relative',
        padding: '120px 40px 100px',
        textAlign: 'center',
        overflow: 'hidden',
      }}>
        {/* Ambient */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(232,232,232,0.04) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,232,232,0.02) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', maxWidth: 760, margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '5px 14px', borderRadius: 99,
            background: 'var(--accent-dim)', border: '1px solid var(--border-2)',
            fontSize: 10, color: 'var(--platinum-3)', fontWeight: 500,
            letterSpacing: '0.06em', textTransform: 'uppercase',
            marginBottom: 32,
          }}>
            <div className="dot-live" />
            AI Receptionist for Service Businesses
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(48px, 8vw, 80px)',
            fontWeight: 300,
            color: 'var(--text)',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            marginBottom: 24,
          }}>
            Never miss a lead.<br />
            <span style={{ color: 'var(--platinum-3)', fontStyle: 'italic' }}>Never lose a job.</span>
          </h1>

          <p style={{ fontSize: 16, color: 'var(--text-3)', lineHeight: 1.7, maxWidth: 480, margin: '0 auto 40px', fontWeight: 300 }}>
            Fono answers every call, qualifies every lead, and books appointments automatically — while you're on the job site.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/auth" className="btn btn-primary" style={{ padding: '11px 28px', fontSize: 13 }}>
              <Link to="/pricing" style={{ fontSize: 12, color: 'var(--text-3)', padding: '7px 14px' }}>Pricing</Link>
              Start Free Trial
            </Link>
            <a href="#how" className="btn btn-ghost" style={{ padding: '11px 28px', fontSize: 13 }}>
              See How It Works
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '0 40px 80px', maxWidth: 860, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'var(--border)', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)' }}>
          {STATS.map(({ value, label }) => (
            <div key={label} style={{ padding: '28px 24px', background: 'var(--black-2)', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 300, color: 'var(--platinum)', letterSpacing: '-0.02em', marginBottom: 6 }}>{value}</div>
              <div style={{ fontSize: 10, color: 'var(--text-4)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '60px 40px 80px', maxWidth: 960, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ fontSize: 10, color: 'var(--text-4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Capabilities</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 300, color: 'var(--text)', letterSpacing: '-0.01em' }}>
            Everything your receptionist does,<br />
            <span style={{ fontStyle: 'italic', color: 'var(--platinum-3)' }}>done automatically.</span>
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'var(--border)', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)' }}>
          {FEATURES.map(({ icon, title, desc }) => (
            <div key={title} style={{ padding: '28px 24px', background: 'var(--black-2)', transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--black-3)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--black-2)'}
            >
              <div style={{ fontSize: 22, marginBottom: 12 }}>{icon}</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 8 }}>{title}</div>
              <div style={{ fontSize: 12, color: 'var(--text-4)', lineHeight: 1.6 }}>{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" style={{ padding: '60px 40px 80px', maxWidth: 860, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ fontSize: 10, color: 'var(--text-4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Process</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 300, color: 'var(--text)', letterSpacing: '-0.01em' }}>Up and running in minutes</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {HOW.map(({ step, title, desc }) => (
            <div key={step} className="card" style={{ position: 'relative' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-4)', letterSpacing: '0.08em', marginBottom: 16 }}>{step}</div>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)', marginBottom: 8 }}>{title}</div>
              <div style={{ fontSize: 12, color: 'var(--text-4)', lineHeight: 1.6 }}>{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '60px 40px 100px', textAlign: 'center' }}>
        <div style={{ maxWidth: 540, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 300, color: 'var(--text)', lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: 16 }}>
            Stop letting missed calls<br />
            <span style={{ fontStyle: 'italic', color: 'var(--platinum-3)' }}>cost you money.</span>
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-4)', marginBottom: 32, lineHeight: 1.7 }}>
            Every missed call is a missed job. Fono makes sure that never happens again.
          </p>
          <Link to="/auth" className="btn btn-primary" style={{ padding: '12px 32px', fontSize: 13 }}>
            Get Started Today
          </Link>
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
        <p style={{ fontSize: 10, color: 'var(--text-4)', letterSpacing: '0.04em' }}>© 2025 Fono. All rights reserved.</p>
      </footer>
    </div>
  )
}

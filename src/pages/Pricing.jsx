import { Link } from 'react-router-dom'

const tiers = [
  {
    name: 'Starter',
    setup: '$1,000',
    monthly: '$300',
    description: 'AI answers your calls and follows up via text. Perfect for solo contractors who just need the phone covered.',
    features: [
      '24/7 AI voice receptionist',
      'Automated SMS lead qualification',
      'Trade-specific intake questions',
      'Dispatch SMS notifications',
      'Caller memory and context',
      'STOP/HELP compliance',
    ],
    cta: 'Get Started',
    href: 'https://buy.stripe.com/aFabJ3cgw20377zcvw7ss06',
    highlight: false,
  },
  {
    name: 'Pro',
    setup: '$3,000',
    monthly: '$750',
    description: 'The full platform. Everything in Starter plus dashboard, lead scoring, calendar sync, and integrations.',
    features: [
      'Everything in Starter',
      'Live dashboard and CRM',
      'Dynamic lead scoring (Hot/Warm/Cold)',
      'Call transcripts and recordings',
      'Google Calendar sync',
      'Website chat widget',
      'Facebook Lead Ads integration',
      'Pipeline management (Kanban)',
      'Analytics and ROI tracking',
      'Sentiment detection',
      'Data export and compliance tools',
      'Proactive follow-up automation',
    ],
    cta: 'Get Started',
    href: 'https://buy.stripe.com/aFadRb2FW8or63v7bc7ss04',
    highlight: true,
  },
  {
    name: 'Partner',
    setup: 'Custom',
    monthly: 'Custom',
    description: 'We become your growth team. Full automation of marketing, lead generation, nurturing, and operations.',
    features: [
      'Everything in Pro',
      'Done-for-you Facebook and Instagram ads',
      'AI-powered ad creative and copy',
      'Automated lead nurturing sequences',
      'Review request automation',
      'Full marketing strategy and execution',
      'Dedicated account manager',
      'Custom integrations',
      'Priority support',
    ],
    cta: 'Contact Us',
    href: 'mailto:mercedes@3on3scalez.com?subject=Fono Partner Inquiry',
    highlight: false,
  },
]

export default function Pricing() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)', fontFamily: 'var(--font)', color: 'var(--text)' }}>

      {/* Nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px', height: 60,
        background: 'rgba(8,8,8,0.85)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 28, height: 28, background: 'var(--platinum)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--black)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.91a16 16 0 006.09 6.09l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
            </svg>
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 500, color: 'var(--platinum)', letterSpacing: '0.04em' }}>fono</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link to="/auth" style={{ fontSize: 12, color: 'var(--text-3)', padding: '7px 14px', textDecoration: 'none' }}>Sign In</Link>
        </div>
      </nav>

      {/* Header */}
      <section style={{ padding: 'clamp(60px, 10vw, 100px) 24px 40px', textAlign: 'center' }}>
        <div style={{ fontSize: 9, color: 'var(--text-4)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>Pricing</div>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 6vw, 48px)',
          fontWeight: 300, color: 'var(--text)', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 16,
        }}>
          Simple pricing.<br />
          <span style={{ color: 'var(--platinum-3)', fontStyle: 'italic' }}>Serious results.</span>
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-4)', maxWidth: 460, margin: '0 auto', lineHeight: 1.7 }}>
          Every plan includes a one-time setup fee and a monthly retainer. No hidden fees, no contracts, cancel anytime.
        </p>
      </section>

      {/* Tiers */}
      <section style={{ padding: '20px 24px 80px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, alignItems: 'stretch' }}>
          {tiers.map(tier => (
            <div key={tier.name} style={{
              background: 'var(--black-3)',
              border: `1px solid ${tier.highlight ? 'rgba(232,232,232,0.2)' : 'var(--border)'}`,
              borderRadius: 14,
              padding: 'clamp(24px, 4vw, 36px)',
              display: 'flex', flexDirection: 'column',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {tier.highlight && (
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                  background: 'linear-gradient(90deg, var(--platinum), rgba(232,232,232,0.3))',
                }} />
              )}

              {tier.highlight && (
                <div style={{
                  display: 'inline-flex', alignSelf: 'flex-start',
                  padding: '4px 12px', borderRadius: 99,
                  background: 'rgba(232,232,232,0.08)', border: '1px solid rgba(232,232,232,0.16)',
                  fontSize: 9, fontWeight: 600, color: 'var(--platinum)',
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  marginBottom: 16,
                }}>
                  Most Popular
                </div>
              )}

              <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
                {tier.name}
              </div>

              <div style={{ marginBottom: 4 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 300, color: 'var(--text)' }}>{tier.monthly}</span>
                {tier.monthly !== 'Custom' && <span style={{ fontSize: 14, color: 'var(--text-4)' }}>/mo</span>}
              </div>

              {tier.setup !== 'Custom' && (
                <div style={{ fontSize: 11, color: 'var(--text-4)', marginBottom: 20 }}>
                  {tier.setup} one-time setup
                </div>
              )}
              {tier.setup === 'Custom' && (
                <div style={{ fontSize: 11, color: 'var(--text-4)', marginBottom: 20 }}>
                  Custom pricing based on scope
                </div>
              )}

              <p style={{ fontSize: 12, color: 'var(--text-4)', lineHeight: 1.7, marginBottom: 24 }}>
                {tier.description}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28, flex: 1 }}>
                {tier.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    <span style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.4 }}>{f}</span>
                  </div>
                ))}
              </div>

              <a href={tier.href} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '12px 24px', borderRadius: 9, fontSize: 13, fontWeight: 500,
                background: tier.highlight ? 'var(--platinum)' : 'transparent',
                color: tier.highlight ? 'var(--black)' : 'var(--text)',
                border: tier.highlight ? 'none' : '1px solid var(--border-2)',
                textDecoration: 'none', letterSpacing: '0.02em',
                transition: 'all 0.15s',
              }}>
                {tier.cta}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ / Bottom CTA */}
      <section style={{ padding: '0 24px 80px', maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
        <div style={{
          padding: 'clamp(24px, 4vw, 36px)',
          background: 'var(--black-3)',
          border: '1px solid var(--border)',
          borderRadius: 14,
        }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 300, color: 'var(--text)', marginBottom: 8 }}>
            Not sure which plan?
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-4)', lineHeight: 1.7, marginBottom: 20 }}>
            Call our demo line and hear the AI receptionist in action. Then reach out and we will find the right fit for your business.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="tel:+19152777385" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '10px 24px', borderRadius: 9, fontSize: 13, fontWeight: 500,
              background: 'var(--platinum)', color: 'var(--black)',
              textDecoration: 'none', letterSpacing: '0.02em', fontFamily: 'var(--font-mono)',
            }}>
              (915) 277-7385
            </a>
            <a href="mailto:mercedes@3on3scalez.com" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '10px 24px', borderRadius: 9, fontSize: 13, fontWeight: 500,
              background: 'transparent', color: 'var(--text-3)',
              border: '1px solid var(--border-2)',
              textDecoration: 'none', letterSpacing: '0.02em',
            }}>
              Email Us
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--platinum-3)', letterSpacing: '0.04em' }}>fono</span>
        </div>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <Link to="/terms" style={{ fontSize: 10, color: 'var(--text-4)', textDecoration: 'none', letterSpacing: '0.04em' }}>Terms</Link>
          <Link to="/privacy" style={{ fontSize: 10, color: 'var(--text-4)', textDecoration: 'none', letterSpacing: '0.04em' }}>Privacy</Link>
          <Link to="/refund" style={{ fontSize: 10, color: 'var(--text-4)', textDecoration: 'none', letterSpacing: '0.04em' }}>Refund</Link>
        </div>
        <p style={{ fontSize: 10, color: 'var(--text-4)', letterSpacing: '0.04em' }}>© 2026 3ON3 LLC. All rights reserved.</p>
      </footer>
    </div>
  )
}

import { Link } from 'react-router-dom'

export default function Refund() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)', fontFamily: 'var(--font)', color: 'var(--text)', padding: '60px 40px' }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <Link to="/" style={{ fontSize: 11, color: 'var(--text-4)', letterSpacing: '0.04em', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 40, textDecoration: 'none' }}>← Back to Home</Link>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 300, color: 'var(--text)', marginBottom: 8 }}>Refund Policy</div>
        <div style={{ fontSize: 11, color: 'var(--text-4)', marginBottom: 48, letterSpacing: '0.04em' }}>Last updated: May 2026</div>
        {[
          ['14-Day Money-Back Guarantee', 'If you are not satisfied with Fono, you may cancel within 14 calendar days of your service activation date and receive a full refund of your first monthly service fee. No questions asked. This applies to all plans:\n\nStarter Plan: Full refund of the $300 monthly fee.\nPro Plan: Full refund of the $750 monthly fee.\nPartner Plan: Refund terms are outlined in your custom agreement.'],

          ['Setup Fees', 'Setup fees are non-refundable once onboarding and system configuration have begun. This includes phone number provisioning, AI configuration, and onboarding support — custom work performed specifically for your business that cannot be reversed.\n\nStarter Plan: $1,000 setup fee (non-refundable).\nPro Plan: $3,000 setup fee (non-refundable).\nPartner Plan: Custom setup fee as outlined in your agreement.'],

          ['After the 14-Day Window', 'After 14 days from service activation, monthly fees are non-refundable. You may cancel your subscription at any time to stop future billing. Cancellation takes effect at the end of your current billing cycle. No partial refunds are issued for unused days in a billing cycle.'],

          ['How to Request a Refund', 'To request a refund within the 14-day window, contact us at mercedes@3on3scalez.com with your business name and the date your service was activated. Refunds are processed within 5-10 business days to your original payment method via Stripe.'],

          ['Exceptions', 'Refunds outside of this policy may be considered on a case-by-case basis at our sole discretion. Contact mercedes@3on3scalez.com to discuss your situation.'],

          ['Contact', 'For refund requests or billing questions:\n\nmercedes@3on3scalez.com\n(210) 672-0944\n\n3ON3 LLC\nEl Paso, TX'],
        ].map(([title, body]) => (
          <div key={title} style={{ marginBottom: 36 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)', marginBottom: 10 }}>{title}</div>
            <div style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.8, whiteSpace: 'pre-line' }}>{body}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

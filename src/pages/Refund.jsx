import { Link } from 'react-router-dom'

export default function Refund() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)', fontFamily: 'var(--font)', color: 'var(--text)', padding: '60px 40px' }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <Link to="/pricing" style={{ fontSize: 11, color: 'var(--text-4)', letterSpacing: '0.04em', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 40 }}>← Back to Pricing</Link>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 300, color: 'var(--text)', marginBottom: 8 }}>Refund Policy</div>
        <div style={{ fontSize: 11, color: 'var(--text-4)', marginBottom: 48, letterSpacing: '0.04em' }}>Last updated: March 2025</div>

        {[
          ['Monthly Service Fee', 'If you are not satisfied with Fono, you may cancel within 14 calendar days of your service activation date and receive a full refund of the initial $750 monthly service fee. No questions asked.'],
          ['Setup Fee', 'The one-time setup fee of $3,500 is non-refundable once onboarding and system configuration have begun. This is because the setup fee covers custom work performed specifically for your business — including phone number provisioning, AI configuration, and onboarding support — which cannot be reversed once completed.'],
          ['How to Request a Refund', 'To request a refund of your monthly fee within the 14-day window, contact us at support@fono.ai with your business name and the date your service was activated. Refunds are processed within 5-10 business days to your original payment method.'],
          ['After the 14-Day Window', 'After 14 days from service activation, monthly fees are non-refundable. You may cancel your subscription at any time to stop future billing, but no partial refunds are issued for unused days in a billing cycle.'],
          ['Exceptions', 'Refunds outside of this policy may be considered on a case-by-case basis at our sole discretion. Contact support@fono.ai to discuss your situation.'],
        ].map(([title, body]) => (
          <div key={title} style={{ marginBottom: 36 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)', marginBottom: 10 }}>{title}</div>
            <div style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.8 }}>{body}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

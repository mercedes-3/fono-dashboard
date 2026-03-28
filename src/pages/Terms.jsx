import { Link } from 'react-router-dom'

export default function Terms() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)', fontFamily: 'var(--font)', color: 'var(--text)', padding: '60px 40px' }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <Link to="/pricing" style={{ fontSize: 11, color: 'var(--text-4)', letterSpacing: '0.04em', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 40 }}>← Back to Pricing</Link>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 300, color: 'var(--text)', marginBottom: 8 }}>Terms of Service</div>
        <div style={{ fontSize: 11, color: 'var(--text-4)', marginBottom: 48, letterSpacing: '0.04em' }}>Last updated: March 2025</div>

        {[
          ['1. Service Description', 'Fono provides an AI-powered receptionist service for home service contractors. This includes inbound call handling, SMS intake, appointment scheduling, lead qualification, and a web-based dashboard. Service is delivered on a monthly subscription basis following a one-time setup and configuration fee.'],
          ['2. Setup Fee', 'A one-time setup fee of $3,500 is required prior to onboarding. This fee covers custom system configuration, phone number provisioning, AI training, and onboarding support. This fee is non-refundable once onboarding and system configuration have begun.'],
          ['3. Monthly Subscription', 'The monthly service fee is $750, billed on a recurring basis. Your subscription begins on the date your AI receptionist is activated. You may cancel your subscription at any time by contacting support.'],
          ['4. Refund Policy', 'You may cancel within 14 calendar days of service activation and receive a full refund of the initial $750 monthly service fee. The $3,500 setup fee is non-refundable in all cases due to the custom work performed during onboarding and configuration.'],
          ['5. Acceptable Use', 'You agree to use Fono only for lawful business purposes. You may not use the service to send spam, harass individuals, or violate any applicable laws or regulations including TCPA and CAN-SPAM requirements.'],
          ['6. Limitation of Liability', 'Fono is not liable for missed calls, failed SMS delivery, or any business losses resulting from service interruptions. Our maximum liability to you shall not exceed the monthly fees paid in the 30 days preceding any claim.'],
          ['7. Changes to Terms', 'We reserve the right to update these Terms at any time. Continued use of the service after changes constitutes acceptance of the new Terms.'],
          ['8. Contact', 'For questions about these Terms, contact us at support@fono.ai'],
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

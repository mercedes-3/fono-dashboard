export default function Privacy() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)', color: 'var(--text)', padding: '80px 24px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <div style={{ fontSize: 10, color: 'var(--text-4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Fono</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 300, letterSpacing: '-0.01em', marginBottom: 32 }}>Privacy Policy</h1>

        <div style={{ fontSize: 13, color: 'var(--text-4)', lineHeight: 2, letterSpacing: '0.01em' }}>
          <p style={{ marginBottom: 20 }}><strong style={{ color: 'var(--text)' }}>Effective Date:</strong> March 31, 2026</p>

          <p style={{ marginBottom: 20 }}>Fono ("we", "us", "our") is operated by 3ON3 LLC. This Privacy Policy explains how we collect, use, and protect your information when you use our AI receptionist platform.</p>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 300, color: 'var(--text)', marginTop: 32, marginBottom: 12 }}>Information We Collect</h2>
          <p style={{ marginBottom: 20 }}>We collect information you provide when creating an account, including your name, email, phone number, and business details. We also collect call data, SMS messages, and lead information processed through our platform on behalf of contractors.</p>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 300, color: 'var(--text)', marginTop: 32, marginBottom: 12 }}>How We Use Your Information</h2>
          <p style={{ marginBottom: 20 }}>We use your information to provide our AI receptionist services, process calls and messages, manage appointments, send service-related SMS communications, process payments, and improve our platform.</p>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 300, color: 'var(--text)', marginTop: 32, marginBottom: 12 }}>SMS Communications</h2>
          <p style={{ marginBottom: 20 }}>Our platform sends automated SMS messages on behalf of contractors to their customers for appointment confirmations, service follow-ups, and lead responses. End users can opt out at any time by replying STOP. Message and data rates may apply. Message frequency varies based on service interactions.</p>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 300, color: 'var(--text)', marginTop: 32, marginBottom: 12 }}>Data Sharing</h2>
          <p style={{ marginBottom: 20 }}>We do not sell your personal information. We share data only with service providers necessary to operate the platform, including Twilio (calls and SMS), Supabase (data storage), Stripe (payments), and Meta/Facebook (lead ads integration when enabled by the contractor).</p>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 300, color: 'var(--text)', marginTop: 32, marginBottom: 12 }}>Data Security</h2>
          <p style={{ marginBottom: 20 }}>We use industry-standard encryption and security measures to protect your data. Access to customer data is restricted to authorized personnel only.</p>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 300, color: 'var(--text)', marginTop: 32, marginBottom: 12 }}>Data Retention</h2>
          <p style={{ marginBottom: 20 }}>We retain your data for as long as your account is active or as needed to provide services. You may request deletion of your data by contacting us.</p>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 300, color: 'var(--text)', marginTop: 32, marginBottom: 12 }}>Contact Us</h2>
          <p style={{ marginBottom: 20 }}>If you have questions about this Privacy Policy, contact us at mercedes@3on3scalez.com.</p>
        </div>

        <a href="/" style={{ display: 'inline-block', marginTop: 32, fontSize: 11, color: 'var(--platinum)', textDecoration: 'none', letterSpacing: '0.04em' }}>Back to Home</a>
      </div>
    </div>
  )
}

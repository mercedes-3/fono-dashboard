import { Link } from 'react-router-dom'

export default function Privacy() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)', fontFamily: 'var(--font)', color: 'var(--text)', padding: '60px 40px' }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <Link to="/" style={{ fontSize: 11, color: 'var(--text-4)', letterSpacing: '0.04em', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 40, textDecoration: 'none' }}>← Back to Home</Link>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 300, color: 'var(--text)', marginBottom: 8 }}>Privacy Policy</div>
        <div style={{ fontSize: 11, color: 'var(--text-4)', marginBottom: 48, letterSpacing: '0.04em' }}>Last updated: May 2026</div>
        {[
          ['Overview', 'Fono ("we", "us", "our") is operated by 3ON3 LLC, a company based in El Paso, Texas. This Privacy Policy explains how we collect, use, store, and protect information when you use our AI receptionist platform. This policy applies to both contractors (our subscribers) and their customers (end users who interact with the AI receptionist via phone, SMS, or web chat).'],

          ['Information We Collect', 'We collect information from contractors including name, email address, phone number, business name, business type, billing information (processed by Stripe), and custom AI instructions.\n\nFrom end users (contractor customers), we collect phone number, name, service address, service type and description, appointment preferences, call recordings and transcripts, SMS message content, web chat messages, and sentiment analysis data.\n\nWe also automatically collect device and browser information, IP addresses, usage data and analytics, and cookies for authentication purposes.'],

          ['How We Use Your Information', 'We use the information we collect to provide and operate the AI receptionist service, process and route phone calls using AI voice technology, send and receive SMS messages for lead qualification and appointment scheduling, manage appointments and sync with Google Calendar, display leads and analytics in the contractor dashboard, process payments and manage subscriptions, send proactive follow-up messages to leads, score and prioritize leads based on urgency and intent, improve our AI models and service quality, comply with legal obligations, and communicate with you about your account and service updates.'],

          ['AI and Voice Technology', 'Fono uses artificial intelligence to handle phone calls and conversations. Specifically, we use Anthropic Claude for natural language understanding and conversation generation, ElevenLabs for text-to-speech voice synthesis, and Twilio for call routing and SMS delivery.\n\nAll calls are answered by AI, not humans. Callers are informed at the beginning of each call that the call may be recorded. Call transcripts are generated automatically and stored in our system. We apply PII redaction to transcripts to remove sensitive information such as Social Security numbers, credit card numbers, and bank account numbers before storage.'],

          ['SMS Communications', 'Our platform sends automated SMS messages on behalf of contractors for appointment confirmations and scheduling, lead qualification and intake questions, service follow-ups and proactive outreach, and system notifications.\n\nEnd users can opt out at any time by replying STOP to any message. Reply HELP for support information. Reply START to re-subscribe. Message and data rates may apply. Message frequency varies based on service interactions. We comply with TCPA regulations and A2P 10DLC messaging requirements.'],

          ['Data Sharing and Third-Party Services', 'We do not sell your personal information to third parties. We share data only with service providers necessary to operate the platform:\n\nTwilio — for phone calls and SMS delivery\nAnthropic — for AI conversation processing\nElevenLabs — for voice synthesis\nSupabase — for data storage and authentication\nStripe — for payment processing\nGoogle — for Calendar integration (when enabled)\nMeta/Facebook — for Lead Ads integration (when enabled)\nUS Census Bureau — for address validation\n\nEach of these providers processes data in accordance with their own privacy policies. We require all service providers to maintain appropriate security measures.'],

          ['Data Security', 'We implement industry-standard security measures to protect your data, including encryption in transit (TLS/SSL) and at rest, row-level security on all database tables ensuring tenant data isolation, server-side API key storage with no sensitive keys exposed in client code, PII redaction on call transcripts before storage, session timeout after 30 minutes of inactivity, rate limiting on public-facing endpoints, and regular security audits of our infrastructure.'],

          ['Data Retention', 'We retain your data for as long as your account is active. Upon account termination, we retain data for 30 days and then permanently delete it. Call recordings are stored securely and retained for the duration of the subscription. You may request immediate deletion of your data at any time through the Settings page in your dashboard or by contacting us directly.'],

          ['Your Rights', 'Depending on your jurisdiction, you may have the following rights:\n\nRight to Access — You can export all your data from the Settings page in your dashboard.\nRight to Deletion — You can delete all your customer data from the Settings page or by contacting us.\nRight to Correction — You can update your information through the dashboard.\nRight to Opt Out — End users can opt out of SMS at any time by replying STOP.\nRight to Know — You can request details about what data we collect and how it is used.\nRight to Non-Discrimination — We will not discriminate against you for exercising your privacy rights.\n\nCalifornia residents have additional rights under the CCPA. EU/EEA residents have additional rights under the GDPR. Contact us to exercise any of these rights.'],

          ['Children\'s Privacy', 'Fono is not intended for use by children under the age of 13. We do not knowingly collect personal information from children. If we become aware that we have collected data from a child under 13, we will delete it immediately.'],

          ['Cookies', 'We use essential cookies for authentication and session management. We do not use tracking cookies or third-party advertising cookies.'],

          ['Changes to This Policy', 'We may update this Privacy Policy from time to time. We will notify you of material changes via email or through the dashboard. The "Last updated" date at the top reflects the most recent revision.'],

          ['Contact Us', 'If you have questions about this Privacy Policy or wish to exercise your privacy rights, contact us at:\n\nmercedes@3on3scalez.com\n(210) 672-0944\n\n3ON3 LLC\nEl Paso, TX'],
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

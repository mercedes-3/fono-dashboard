import { Link } from 'react-router-dom'

export default function Terms() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)', fontFamily: 'var(--font)', color: 'var(--text)', padding: '60px 40px' }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <Link to="/" style={{ fontSize: 11, color: 'var(--text-4)', letterSpacing: '0.04em', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 40, textDecoration: 'none' }}>← Back to Home</Link>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 300, color: 'var(--text)', marginBottom: 8 }}>Terms of Service</div>
        <div style={{ fontSize: 11, color: 'var(--text-4)', marginBottom: 48, letterSpacing: '0.04em' }}>Last updated: May 2026</div>
        {[
          ['1. Agreement to Terms', 'By accessing or using Fono ("the Service"), operated by 3ON3 LLC ("we", "us", "our"), you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the Service. These terms apply to all users, including contractors (subscribers) and their customers (end users) who interact with the AI receptionist.'],

          ['2. Service Description', 'Fono provides an AI-powered receptionist platform for home service contractors. This includes automated inbound call handling using artificial intelligence, SMS-based lead qualification and follow-up, appointment scheduling and management, a web-based dashboard with CRM and analytics, Google Calendar integration, website chat widget, and Facebook Lead Ads integration. You acknowledge that calls are handled by artificial intelligence, not a human receptionist. The AI may occasionally make errors in understanding or transcription.'],

          ['3. Pricing and Billing', 'Fono offers the following service tiers:\n\nStarter Plan: $1,000 one-time setup fee + $300/month. Includes AI voice receptionist and SMS lead qualification.\n\nPro Plan: $3,000 one-time setup fee + $750/month. Includes the full platform with dashboard, lead scoring, calendar sync, analytics, and integrations.\n\nPartner Plan: Custom pricing based on scope. Includes done-for-you marketing, lead generation, and business automation.\n\nAll prices are in USD. Setup fees are charged at checkout. Monthly fees are billed on a recurring basis starting from the date of service activation. You authorize us to charge your payment method on file for all applicable fees.'],

          ['4. Refund Policy', 'Monthly Service Fee: You may cancel within 14 calendar days of service activation and receive a full refund of your first monthly fee. No questions asked.\n\nSetup Fee: Setup fees are non-refundable once onboarding and system configuration have begun. This is because the setup fee covers custom work performed specifically for your business, including phone number provisioning, AI configuration, and onboarding support, which cannot be reversed once completed.\n\nAfter the 14-Day Window: Monthly fees are non-refundable. You may cancel at any time to stop future billing. No partial refunds are issued for unused days in a billing cycle.\n\nTo request a refund, contact mercedes@3on3scalez.com with your business name and activation date. Refunds are processed within 5-10 business days.'],

          ['5. Call Recording and AI Disclosure', 'All calls handled by the Fono AI receptionist may be recorded and transcribed for quality assurance and service delivery purposes. Callers are notified at the beginning of each call that the call may be recorded. By using Fono, you consent to the recording and transcription of calls made to your Fono phone number. You are responsible for ensuring compliance with applicable call recording laws in your jurisdiction, including two-party consent states. Fono provides a recording disclosure at the start of each call, but you should consult with a legal professional regarding your specific obligations.'],

          ['6. SMS and TCPA Compliance', 'Fono sends automated SMS messages on behalf of contractors to their customers. These messages include appointment confirmations, service follow-ups, lead qualification questions, and proactive outreach. By using Fono, you agree to comply with the Telephone Consumer Protection Act (TCPA) and all applicable messaging regulations. You represent that you have obtained proper consent from your customers to receive automated text messages. End users may opt out at any time by replying STOP. Standard message and data rates may apply. Message frequency varies based on service interactions.'],

          ['7. Data Ownership and Privacy', 'You retain ownership of all customer data collected through the Fono platform, including leads, call recordings, transcripts, messages, and appointment information. We process this data solely to provide the Service. We do not sell your data or your customers\' data to third parties. Our handling of personal information is described in our Privacy Policy. You are responsible for ensuring your use of Fono complies with applicable privacy laws, including CCPA and GDPR where applicable.'],

          ['8. Acceptable Use', 'You agree to use Fono only for lawful business purposes. You may not use the Service to send spam or unsolicited messages, harass, threaten, or abuse any individual, violate any applicable law or regulation including TCPA and CAN-SPAM, transmit malware or attempt to compromise system security, impersonate another business or individual, or use the Service for any illegal or fraudulent purpose. We reserve the right to suspend or terminate your account for violation of these terms.'],

          ['9. Service Availability and Uptime', 'We strive to maintain high availability of the Service but do not guarantee 100% uptime. The Service may be temporarily unavailable due to maintenance, updates, or circumstances beyond our control. We are not liable for any business losses resulting from service interruptions, including missed calls, failed SMS delivery, or dashboard downtime.'],

          ['10. Limitation of Liability', 'TO THE MAXIMUM EXTENT PERMITTED BY LAW, FONO AND 3ON3 LLC SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, REVENUE, BUSINESS, OR DATA. OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID TO US IN THE 30 DAYS PRECEDING THE CLAIM. THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED.'],

          ['11. Indemnification', 'You agree to indemnify and hold harmless 3ON3 LLC, its officers, employees, and agents from any claims, damages, losses, or expenses arising from your use of the Service, your violation of these Terms, or your violation of any applicable law or regulation.'],

          ['12. Dispute Resolution', 'Any disputes arising from these Terms or your use of the Service shall be resolved through binding arbitration in El Paso, Texas, in accordance with the rules of the American Arbitration Association. You agree to waive any right to a jury trial or to participate in a class action lawsuit.'],

          ['13. Termination', 'Either party may terminate the Service at any time. You may cancel by contacting mercedes@3on3scalez.com. Upon termination, your access to the dashboard will be revoked and your AI receptionist will be deactivated. You may request export of your data prior to termination. We will retain your data for 30 days after termination, after which it will be permanently deleted.'],

          ['14. Changes to Terms', 'We reserve the right to update these Terms at any time. We will notify you of material changes via email or through the dashboard. Continued use of the Service after changes constitutes acceptance of the updated Terms.'],

          ['15. Governing Law', 'These Terms are governed by the laws of the State of Texas without regard to conflict of law provisions.'],

          ['16. Contact', 'For questions about these Terms, contact us at mercedes@3on3scalez.com or call (210) 672-0944.\n\n3ON3 LLC\nEl Paso, TX'],
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

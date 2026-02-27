import { Shield, Lock, Eye, Database, UserCheck, Globe } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';

const sections = [
  {
    icon: Database,
    title: 'Information We Collect',
    content: [
      'When you use EEC, we may collect the following types of information:',
      '**Personal Information:** Name, email address, and any other information you provide when signing up, booking a call, or downloading resources.',
      '**Usage Data:** Information about how you interact with our website, including pages visited, time spent, and features used.',
      '**Device Information:** Browser type, operating system, IP address, and device identifiers.',
      '**Cookies and Tracking:** We use cookies and similar technologies to enhance your experience. See our Cookie Policy for details.',
    ],
  },
  {
    icon: Eye,
    title: 'How We Use Your Information',
    content: [
      'We use the information we collect to:',
      '• Provide and improve our services, including email engagement tools and community features.',
      '• Send you the EEC Playbook, newsletters, and relevant content you\'ve opted into.',
      '• Process bookings and communicate about scheduled calls.',
      '• Analyze usage patterns to improve our platform.',
      '• Comply with legal obligations and protect our rights.',
    ],
  },
  {
    icon: UserCheck,
    title: 'Your Rights',
    content: [
      'Depending on your location, you may have the following rights regarding your personal data:',
      '**Access:** Request a copy of the personal data we hold about you.',
      '**Correction:** Request correction of inaccurate or incomplete data.',
      '**Deletion:** Request deletion of your personal data, subject to legal retention requirements.',
      '**Opt-Out:** Unsubscribe from marketing communications at any time using the link in our emails.',
      '**Data Portability:** Request a portable copy of your data in a machine-readable format.',
      'To exercise any of these rights, contact us at hello@eec.community.',
    ],
  },
  {
    icon: Shield,
    title: 'Data Security',
    content: [
      'We implement industry-standard security measures to protect your personal information, including:',
      '• Encryption of data in transit using TLS/SSL.',
      '• Secure storage of personal data with access controls.',
      '• Regular security audits and vulnerability assessments.',
      'While we strive to protect your data, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.',
    ],
  },
  {
    icon: Globe,
    title: 'Third-Party Services',
    content: [
      'We may share your information with trusted third-party services that help us operate our platform:',
      '• **Email Service Providers:** To deliver newsletters and automated emails.',
      '• **Analytics Providers:** To understand usage patterns and improve our services.',
      '• **Payment Processors:** To handle transactions securely.',
      'We do not sell your personal information to third parties. Third-party services are bound by their own privacy policies.',
    ],
  },
  {
    icon: Lock,
    title: 'Data Retention',
    content: [
      'We retain your personal data only for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law.',
      'If you request deletion of your account, we will remove your personal data within 30 days, except where we are legally required to retain it.',
    ],
  },
];

export default function PrivacyPage() {
  return (
    <PageLayout
      title={<>Privacy <span className="text-gradient">Policy</span></>}
      subtitle="Your privacy matters to us. This policy explains how EEC collects, uses, and protects your personal information."
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto">
          {/* Last Updated */}
          <p className="text-sm text-[#666] mb-12 text-center">
            Last updated: February 28, 2026
          </p>

          {/* Sections */}
          <div className="space-y-12">
            {sections.map((section, index) => (
              <div
                key={index}
                className="bg-[#1a1a1a] rounded-2xl border border-white/10 p-8"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[#00ff88]/10 flex items-center justify-center">
                    <section.icon className="w-6 h-6 text-[#00ff88]" />
                  </div>
                  <h2 className="text-xl font-bold">{section.title}</h2>
                </div>
                <div className="space-y-3">
                  {section.content.map((paragraph, pIndex) => (
                    <p
                      key={pIndex}
                      className="text-[#a0a0a0] leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: paragraph
                          .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>'),
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div className="mt-12 text-center text-[#a0a0a0]">
            <p>
              Questions about this privacy policy? Contact us at{' '}
              <a href="mailto:hello@eec.community" className="text-[#00ff88] hover:underline">
                hello@eec.community
              </a>
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

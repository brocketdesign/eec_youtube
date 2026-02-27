import { FileText, AlertTriangle, Scale, CreditCard, Ban, RefreshCw } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';

const sections = [
  {
    icon: FileText,
    title: 'Acceptance of Terms',
    content: [
      'By accessing or using the EEC (Email Engagement Community) platform, website, and services, you agree to be bound by these Terms of Service.',
      'If you do not agree to these terms, please do not use our services. We reserve the right to update these terms at any time, and your continued use of the platform constitutes acceptance of any changes.',
      'These terms apply to all visitors, users, and others who access or use our services.',
    ],
  },
  {
    icon: Scale,
    title: 'Use of Services',
    content: [
      'EEC provides tools and resources for gaming content creators to build and engage their email audiences. By using our services, you agree to:',
      '• Use the platform only for lawful purposes and in accordance with these terms.',
      '• Provide accurate and complete information when creating an account or booking services.',
      '• Not reproduce, duplicate, copy, sell, or exploit any portion of the service without express permission.',
      '• Not use automated systems (bots, scrapers) to access the platform without prior written consent.',
      '• Not attempt to interfere with or disrupt the integrity or performance of the platform.',
    ],
  },
  {
    icon: CreditCard,
    title: 'Payments and Subscriptions',
    content: [
      'Certain features of EEC may require payment. By purchasing a subscription or service:',
      '• You agree to pay all fees associated with your selected plan.',
      '• Prices are subject to change with reasonable notice.',
      '• All payments are processed securely through our third-party payment providers.',
      '• Subscriptions automatically renew unless cancelled before the renewal date.',
      '• You are responsible for keeping your payment information up to date.',
    ],
  },
  {
    icon: RefreshCw,
    title: 'Refund Policy',
    content: [
      'We want you to be satisfied with our services. Our refund policy is as follows:',
      '• **Digital Products:** Due to the nature of digital products (playbooks, templates, guides), refunds are generally not available once the content has been accessed or downloaded.',
      '• **Subscriptions:** You may cancel your subscription at any time. Refunds for partial billing periods are not provided.',
      '• **Consultation Calls:** Cancellations made at least 24 hours before a scheduled call are eligible for rescheduling or refund. No-shows are not eligible for refunds.',
      'For exceptional circumstances, please contact us at hello@eec.community.',
    ],
  },
  {
    icon: Ban,
    title: 'Prohibited Activities',
    content: [
      'When using EEC, you must not:',
      '• Send spam or unsolicited messages through our platform.',
      '• Upload content that is illegal, harmful, threatening, abusive, or otherwise objectionable.',
      '• Impersonate any person or entity, or falsely represent your affiliation.',
      '• Attempt to gain unauthorized access to other user accounts or platform systems.',
      '• Use the platform to collect personal information of other users without consent.',
      '• Violate any applicable laws or regulations.',
      'We reserve the right to terminate or suspend accounts that violate these terms without prior notice.',
    ],
  },
  {
    icon: AlertTriangle,
    title: 'Limitation of Liability',
    content: [
      'To the maximum extent permitted by law:',
      '• EEC is provided "as is" and "as available" without warranties of any kind.',
      '• We do not guarantee that the platform will be uninterrupted, secure, or error-free.',
      '• We are not liable for any indirect, incidental, special, consequential, or punitive damages.',
      '• Our total liability for any claim arising from these terms shall not exceed the amount you paid us in the 12 months preceding the claim.',
      '• We are not responsible for third-party content, services, or links accessible through our platform.',
    ],
  },
];

export default function TermsPage() {
  return (
    <PageLayout
      title={<>Terms of <span className="text-gradient">Service</span></>}
      subtitle="Please read these terms carefully before using the EEC platform and services."
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
              Questions about these terms? Contact us at{' '}
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

import { Cookie, Settings, BarChart3, Shield, ToggleRight, HelpCircle } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';

const cookieTypes = [
  {
    name: 'Essential Cookies',
    required: true,
    description:
      'These cookies are necessary for the website to function properly. They enable core features like page navigation, access to secure areas, and remembering your preferences. These cannot be disabled.',
    examples: ['Session management', 'Security tokens', 'Load balancing'],
  },
  {
    name: 'Analytics Cookies',
    required: false,
    description:
      'These cookies help us understand how visitors interact with our website by collecting information anonymously. This helps us improve our platform and content.',
    examples: ['Page views and navigation paths', 'Time spent on pages', 'Bounce rate and traffic sources'],
  },
  {
    name: 'Functional Cookies',
    required: false,
    description:
      'These cookies enable enhanced functionality and personalization, such as remembering your preferences, language settings, and form data.',
    examples: ['Language preferences', 'Theme settings', 'Form auto-fill data'],
  },
  {
    name: 'Marketing Cookies',
    required: false,
    description:
      'These cookies may be set through our site by advertising partners to build a profile of your interests and show you relevant content on other sites. We currently do not use marketing cookies but reserve the right to in the future.',
    examples: ['Ad targeting', 'Campaign performance', 'Cross-site tracking'],
  },
];

const sections = [
  {
    icon: Cookie,
    title: 'What Are Cookies?',
    content:
      'Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to the site owners. Cookies help us remember your preferences and understand how you use our platform.',
  },
  {
    icon: Settings,
    title: 'How We Use Cookies',
    content:
      'EEC uses cookies for several purposes: to keep you signed in, to remember your preferences, to understand how you use our platform, and to improve your overall experience. We also use cookies to ensure the security of our services.',
  },
  {
    icon: BarChart3,
    title: 'Third-Party Cookies',
    content:
      'Some cookies are placed by third-party services that appear on our pages. We use analytics services to help us understand how our platform is used. These third parties may use cookies to collect information about your online activities across different websites.',
  },
  {
    icon: ToggleRight,
    title: 'Managing Your Cookies',
    content:
      'You can control and manage cookies in several ways. Most browsers allow you to refuse or accept cookies, delete cookies, and set preferences for certain websites. You can usually find these settings in the "Options" or "Preferences" menu of your browser. Note that disabling certain cookies may affect the functionality of our website.',
  },
  {
    icon: Shield,
    title: 'Your Consent',
    content:
      'By continuing to use our website, you consent to our use of cookies as described in this policy. You can withdraw your consent at any time by clearing your cookies or adjusting your browser settings. For essential cookies, consent is not required as they are necessary for the website to function.',
  },
  {
    icon: HelpCircle,
    title: 'Updates to This Policy',
    content:
      'We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our data practices. We will post any changes on this page with an updated revision date. We encourage you to review this policy periodically.',
  },
];

export default function CookiePage() {
  return (
    <PageLayout
      title={<>Cookie <span className="text-gradient">Policy</span></>}
      subtitle="This policy explains how EEC uses cookies and similar technologies to recognize you when you visit our platform."
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto">
          {/* Last Updated */}
          <p className="text-sm text-[#666] mb-12 text-center">
            Last updated: February 28, 2026
          </p>

          {/* Info Sections */}
          <div className="space-y-12 mb-16">
            {sections.map((section, index) => (
              <div
                key={index}
                className="bg-[#1a1a1a] rounded-2xl border border-white/10 p-8"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#00ff88]/10 flex items-center justify-center">
                    <section.icon className="w-6 h-6 text-[#00ff88]" />
                  </div>
                  <h2 className="text-xl font-bold">{section.title}</h2>
                </div>
                <p className="text-[#a0a0a0] leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>

          {/* Cookie Types Table */}
          <h2 className="text-2xl font-bold mb-8 text-center">
            Types of Cookies We Use
          </h2>
          <div className="space-y-6">
            {cookieTypes.map((cookie, index) => (
              <div
                key={index}
                className="bg-[#1a1a1a] rounded-2xl border border-white/10 p-8"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">{cookie.name}</h3>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${
                      cookie.required
                        ? 'bg-[#00ff88]/10 text-[#00ff88]'
                        : 'bg-white/5 text-[#a0a0a0]'
                    }`}
                  >
                    {cookie.required ? 'Required' : 'Optional'}
                  </span>
                </div>
                <p className="text-[#a0a0a0] mb-4">{cookie.description}</p>
                <div className="flex flex-wrap gap-2">
                  {cookie.examples.map((example, eIndex) => (
                    <span
                      key={eIndex}
                      className="text-xs px-3 py-1 rounded-lg bg-white/5 text-[#666]"
                    >
                      {example}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div className="mt-12 text-center text-[#a0a0a0]">
            <p>
              Questions about our cookie policy? Contact us at{' '}
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

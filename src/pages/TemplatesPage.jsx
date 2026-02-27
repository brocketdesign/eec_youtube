import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Download, ArrowRight, Mail, Megaphone, BarChart3, UserPlus, Palette, Sparkles } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';

const templates = [
  {
    icon: UserPlus,
    title: 'Welcome Sequence (5 Emails)',
    description:
      'A proven 5-email welcome sequence that turns new subscribers into engaged community members. Customizable for any gaming niche.',
    category: 'Onboarding',
    format: 'Email Templates',
  },
  {
    icon: Mail,
    title: 'Weekly Newsletter Template',
    description:
      'A clean, gaming-themed newsletter template with sections for content highlights, community spotlights, and calls to action.',
    category: 'Newsletter',
    format: 'Email Template',
  },
  {
    icon: Megaphone,
    title: 'Product Launch Sequence',
    description:
      'A 7-email launch sequence for merch drops, course launches, or premium content releases. Build hype and drive sales.',
    category: 'Launch',
    format: 'Email Templates',
  },
  {
    icon: BarChart3,
    title: 'Re-engagement Campaign',
    description:
      'Win back inactive subscribers with this 3-email re-engagement sequence. Includes subject lines proven to get opens.',
    category: 'Retention',
    format: 'Email Templates',
  },
  {
    icon: Palette,
    title: 'Lead Magnet Landing Page',
    description:
      'A high-converting landing page template designed for gaming lead magnets — checklists, guides, and exclusive content offers.',
    category: 'Landing Pages',
    format: 'Page Template',
  },
  {
    icon: Sparkles,
    title: 'Content Calendar Spreadsheet',
    description:
      'Plan your newsletter content for 3 months with this gaming-specific content calendar. Includes topic ideas and send schedule.',
    category: 'Planning',
    format: 'Spreadsheet',
  },
  {
    icon: FileText,
    title: 'Sponsorship Pitch Email',
    description:
      'Reach out to gaming brands with this proven sponsorship pitch template. Includes media kit format and rate suggestions.',
    category: 'Monetization',
    format: 'Email Template',
  },
  {
    icon: Download,
    title: 'Email List Growth Checklist',
    description:
      'A comprehensive checklist of 50+ tactics to grow your gaming email list. From YouTube end screens to Twitch commands.',
    category: 'Growth',
    format: 'Checklist',
  },
];

const categoryColors = {
  Onboarding: 'bg-blue-500/10 text-blue-400',
  Newsletter: 'bg-purple-500/10 text-purple-400',
  Launch: 'bg-[#00ff88]/10 text-[#00ff88]',
  Retention: 'bg-yellow-500/10 text-yellow-400',
  'Landing Pages': 'bg-cyan-500/10 text-cyan-400',
  Planning: 'bg-pink-500/10 text-pink-400',
  Monetization: 'bg-orange-500/10 text-orange-400',
  Growth: 'bg-green-500/10 text-green-400',
};

export default function TemplatesPage() {
  return (
    <PageLayout
      title={<>Email <span className="text-gradient">Templates</span></>}
      subtitle="Proven email templates, sequences, and resources designed specifically for gaming creators."
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="max-w-5xl mx-auto">
          {/* Template Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {templates.map((template, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-[#1a1a1a] rounded-2xl border border-white/10 p-8 hover:border-[#00ff88]/20 transition-all duration-300 group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#00ff88]/10 flex items-center justify-center">
                    <template.icon className="w-6 h-6 text-[#00ff88]" />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[template.category] || 'bg-white/5 text-[#a0a0a0]'}`}>
                    {template.category}
                  </span>
                </div>

                <h3 className="text-lg font-bold mb-3 group-hover:text-[#00ff88] transition-colors">
                  {template.title}
                </h3>
                <p className="text-[#a0a0a0] text-sm mb-4 leading-relaxed">{template.description}</p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#666]">{template.format}</span>
                  <span className="text-xs text-[#00ff88] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    Get Template <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <div className="bg-[#1a1a1a] rounded-2xl border border-[#00ff88]/20 p-8 lg:p-12 text-center">
            <Download className="w-10 h-10 text-[#00ff88] mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-3">Get All Templates Free</h2>
            <p className="text-[#a0a0a0] mb-6 max-w-md mx-auto">
              Download the complete EEC Playbook and get every template, sequence, and resource — absolutely free.
            </p>
            <Link
              to="/#cta"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#00ff88] to-[#00d4aa] text-[#0a0a0a] font-bold hover:opacity-90 transition-opacity"
            >
              Download the Playbook
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

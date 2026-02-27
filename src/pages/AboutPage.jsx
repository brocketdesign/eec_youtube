import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Target, Heart, Zap, Users, Shield, Gamepad2, ArrowRight } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';

const values = [
  {
    icon: Target,
    title: 'Creator-First',
    description:
      'Everything we build starts with one question: does this help creators own their audience? If the answer isn\'t a clear yes, we don\'t ship it.',
  },
  {
    icon: Heart,
    title: 'Community Over Competition',
    description:
      'We believe gaming creators succeed together. Our community is built on sharing strategies, celebrating wins, and lifting each other up.',
  },
  {
    icon: Zap,
    title: 'Action-Oriented',
    description:
      'No fluff, no hype. We provide proven playbooks, actionable templates, and real strategies that creators can implement immediately.',
  },
  {
    icon: Shield,
    title: 'Independence',
    description:
      'We\'re building tools that help creators break free from platform dependency. Your audience should belong to you, not an algorithm.',
  },
];

const team = [
  {
    emoji: '🎮',
    name: 'The EEC Team',
    role: 'Founders & Builders',
    bio: 'We\'re a team of gaming enthusiasts and email marketing specialists who saw a gap in the creator economy. Too many talented gaming creators were stuck on the platform revenue treadmill, and we knew there was a better way.',
  },
];

const milestones = [
  { year: '2024', event: 'EEC concept born from firsthand creator struggles' },
  { year: '2025', event: 'Beta launch with first 100 gaming creators' },
  { year: '2025', event: 'Published the EEC Playbook — 10K+ downloads' },
  { year: '2026', event: 'Full platform launch with community features' },
];

export default function AboutPage() {
  return (
    <PageLayout
      title={<>About <span className="text-gradient">EEC</span></>}
      subtitle="We're on a mission to help gaming creators build sustainable businesses by owning their audience."
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="max-w-5xl mx-auto">
          {/* Mission Statement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#1a1a1a] rounded-2xl border border-[#00ff88]/20 p-8 lg:p-12 mb-16 text-center"
          >
            <Gamepad2 className="w-12 h-12 text-[#00ff88] mx-auto mb-6" />
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-lg text-[#a0a0a0] max-w-3xl mx-auto leading-relaxed">
              The gaming creator economy is broken. Millions of talented creators pour their hearts into
              content, only to have their livelihoods depend on algorithms they can't control. EEC exists
              to change that — by giving creators the tools, knowledge, and community to build direct
              relationships with their audience through email.
            </p>
          </motion.div>

          {/* Values */}
          <h2 className="text-2xl font-bold text-center mb-8">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#1a1a1a] rounded-2xl border border-white/10 p-8 hover:border-[#00ff88]/20 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-[#00ff88]/10 flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-[#00ff88]" />
                </div>
                <h3 className="text-lg font-bold mb-2">{value.title}</h3>
                <p className="text-[#a0a0a0] leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Team */}
          <h2 className="text-2xl font-bold text-center mb-8">Who We Are</h2>
          <div className="mb-16">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-[#1a1a1a] rounded-2xl border border-white/10 p-8 text-center max-w-2xl mx-auto"
              >
                <span className="text-5xl mb-4 block">{member.emoji}</span>
                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                <p className="text-[#00ff88] text-sm mb-4">{member.role}</p>
                <p className="text-[#a0a0a0] leading-relaxed">{member.bio}</p>
              </motion.div>
            ))}
          </div>

          {/* Timeline */}
          <h2 className="text-2xl font-bold text-center mb-8">Our Journey</h2>
          <div className="max-w-2xl mx-auto mb-16">
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-px bg-[#00ff88]/20" />
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-6 mb-8 last:mb-0"
                >
                  <div className="w-8 h-8 rounded-full bg-[#00ff88]/10 border-2 border-[#00ff88] flex items-center justify-center flex-shrink-0 z-10">
                    <div className="w-2 h-2 rounded-full bg-[#00ff88]" />
                  </div>
                  <div>
                    <span className="text-sm text-[#00ff88] font-medium">{milestone.year}</span>
                    <p className="text-[#a0a0a0]">{milestone.event}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <p className="text-[#a0a0a0] mb-6">Want to be part of the story?</p>
            <Link
              to="/#cta"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#00ff88] to-[#00d4aa] text-[#0a0a0a] font-bold hover:opacity-90 transition-opacity"
            >
              Join the Community
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

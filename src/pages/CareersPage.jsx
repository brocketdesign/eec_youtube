import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Rocket, Users, Coffee, ArrowRight } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';

const perks = [
  {
    icon: Rocket,
    title: 'Shape the Future',
    description: 'Work on products that directly impact gaming creators worldwide.',
  },
  {
    icon: Heart,
    title: 'Passionate Team',
    description: 'Join a team of gamers and builders who love what they do.',
  },
  {
    icon: Users,
    title: 'Remote-First',
    description: 'Work from anywhere. We believe in results, not hours at a desk.',
  },
  {
    icon: Coffee,
    title: 'Creator Culture',
    description: 'Game together, build together. We practice what we preach.',
  },
];

const openings = [
  {
    title: 'Full-Stack Developer',
    type: 'Full-time · Remote',
    description:
      'Help us build the next generation of email engagement tools for gaming creators. Experience with React, Node.js, and email infrastructure preferred.',
  },
  {
    title: 'Community Manager',
    type: 'Full-time · Remote',
    description:
      'Grow and nurture our community of gaming creators. You\'ll be the bridge between our users and our product team.',
  },
  {
    title: 'Content Strategist',
    type: 'Part-time · Remote',
    description:
      'Create educational content that helps gaming creators master email marketing. Experience in the creator economy is a plus.',
  },
];

export default function CareersPage() {
  return (
    <PageLayout
      title={<>Join the <span className="text-gradient">Team</span></>}
      subtitle="Help us empower gaming creators to own their audience and build sustainable businesses."
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="max-w-5xl mx-auto">
          {/* Why Join Us */}
          <h2 className="text-2xl font-bold text-center mb-8">Why Join EEC?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
            {perks.map((perk, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#1a1a1a] rounded-2xl border border-white/10 p-6 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-[#00ff88]/10 flex items-center justify-center mx-auto mb-4">
                  <perk.icon className="w-6 h-6 text-[#00ff88]" />
                </div>
                <h3 className="font-bold mb-2">{perk.title}</h3>
                <p className="text-sm text-[#a0a0a0]">{perk.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Open Positions */}
          <h2 className="text-2xl font-bold text-center mb-8">Open Positions</h2>
          <div className="space-y-6 mb-16">
            {openings.map((job, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#1a1a1a] rounded-2xl border border-white/10 p-8 hover:border-[#00ff88]/20 transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-lg font-bold">{job.title}</h3>
                    <p className="text-sm text-[#00ff88]">{job.type}</p>
                  </div>
                  <a
                    href="mailto:careers@eec.community"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-medium hover:bg-[#00ff88]/10 hover:border-[#00ff88]/30 hover:text-[#00ff88] transition-all duration-300"
                  >
                    Apply Now
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
                <p className="text-[#a0a0a0]">{job.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Don't See a Fit */}
          <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 p-8 lg:p-12 text-center">
            <h2 className="text-2xl font-bold mb-3">Don't see the right role?</h2>
            <p className="text-[#a0a0a0] mb-6 max-w-md mx-auto">
              We're always looking for talented people who are passionate about gaming and the creator economy. Send us your info.
            </p>
            <a
              href="mailto:careers@eec.community"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#00ff88] to-[#00d4aa] text-[#0a0a0a] font-bold hover:opacity-90 transition-opacity"
            >
              Get in Touch
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

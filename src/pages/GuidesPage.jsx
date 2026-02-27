import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Clock, ArrowRight, Target, Mail, DollarSign, Users, Zap } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';

const guides = [
  {
    icon: Mail,
    title: 'Email List Building for Gaming Creators',
    description:
      'The complete guide to building your first 1,000 email subscribers as a gaming content creator. From lead magnets to opt-in forms.',
    difficulty: 'Beginner',
    readTime: '15 min',
    chapters: 8,
    color: 'text-green-400 bg-green-500/10',
  },
  {
    icon: Target,
    title: 'Writing Newsletters Your Audience Actually Opens',
    description:
      'Master the art of writing compelling gaming newsletters with high open rates. Subject lines, content structure, and storytelling frameworks.',
    difficulty: 'Intermediate',
    readTime: '20 min',
    chapters: 10,
    color: 'text-yellow-400 bg-yellow-500/10',
  },
  {
    icon: DollarSign,
    title: 'Monetizing Your Gaming Email List',
    description:
      'Seven proven revenue streams for gaming newsletters — from premium subscriptions to exclusive merch drops and affiliate partnerships.',
    difficulty: 'Advanced',
    readTime: '25 min',
    chapters: 12,
    color: 'text-red-400 bg-red-500/10',
  },
  {
    icon: Users,
    title: 'Building a Community Ecosystem',
    description:
      'How to connect your email list with Discord, Twitch, and YouTube to create a self-reinforcing community that grows organically.',
    difficulty: 'Intermediate',
    readTime: '18 min',
    chapters: 9,
    color: 'text-yellow-400 bg-yellow-500/10',
  },
  {
    icon: Zap,
    title: 'Email Automation for Creators',
    description:
      'Set up welcome sequences, re-engagement campaigns, and product launch funnels that work while you sleep.',
    difficulty: 'Intermediate',
    readTime: '22 min',
    chapters: 11,
    color: 'text-yellow-400 bg-yellow-500/10',
  },
  {
    icon: BookOpen,
    title: 'From 0 to 10K Subscribers Playbook',
    description:
      'A step-by-step playbook that takes you from zero email subscribers to 10,000 engaged fans. Includes timelines, checklists, and milestones.',
    difficulty: 'Beginner',
    readTime: '30 min',
    chapters: 15,
    color: 'text-green-400 bg-green-500/10',
  },
];

const difficultyColors = {
  Beginner: 'bg-green-500/10 text-green-400',
  Intermediate: 'bg-yellow-500/10 text-yellow-400',
  Advanced: 'bg-red-500/10 text-red-400',
};

export default function GuidesPage() {
  return (
    <PageLayout
      title={<>Creator <span className="text-gradient">Guides</span></>}
      subtitle="Step-by-step guides to help you master email marketing for gaming audiences."
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="max-w-5xl mx-auto">
          {/* Difficulty Legend */}
          <div className="flex items-center justify-center gap-6 mb-12">
            {Object.entries(difficultyColors).map(([level, classes]) => (
              <span key={level} className={`px-3 py-1 rounded-full text-xs font-medium ${classes}`}>
                {level}
              </span>
            ))}
          </div>

          {/* Guide Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {guides.map((guide, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#1a1a1a] rounded-2xl border border-white/10 p-8 hover:border-[#00ff88]/20 transition-all duration-300 group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#00ff88]/10 flex items-center justify-center">
                    <guide.icon className="w-6 h-6 text-[#00ff88]" />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${difficultyColors[guide.difficulty]}`}>
                    {guide.difficulty}
                  </span>
                </div>

                <h3 className="text-lg font-bold mb-3 group-hover:text-[#00ff88] transition-colors">
                  {guide.title}
                </h3>
                <p className="text-[#a0a0a0] text-sm mb-6 leading-relaxed">{guide.description}</p>

                <div className="flex items-center gap-4 text-xs text-[#666]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {guide.readTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    {guide.chapters} chapters
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <p className="text-[#a0a0a0] mb-6">Get all guides plus the full EEC Playbook</p>
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

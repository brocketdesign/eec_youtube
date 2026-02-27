import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Mail, DollarSign, ArrowRight, Quote } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';

const caseStudies = [
  {
    title: 'From Algorithm-Dependent to $15K/Month',
    game: 'Fortnite',
    avatar: '🎮',
    subscribers: '500K',
    highlight: '+2,900% revenue increase',
    stats: [
      { label: 'Email List Size', value: '45K', icon: Mail },
      { label: 'Monthly Revenue', value: '$15K', icon: DollarSign },
      { label: 'Open Rate', value: '42%', icon: TrendingUp },
      { label: 'Community Members', value: '12K', icon: Users },
    ],
    story:
      'After joining EEC, this Fortnite creator transformed their entire business model. They went from relying solely on YouTube ad revenue ($500/month) to building a thriving email community that generates consistent income through premium content, merchandise drops, and sponsored newsletters.',
    results: [
      'Built a 45K email list in 8 months',
      'Launched a premium newsletter tier at $9.99/month',
      'Created an exclusive Discord community with 12K members',
      'Reduced platform dependency by 80%',
    ],
  },
  {
    title: 'Indie Dev Builds Pre-Launch Audience of 20K',
    game: 'Indie Game Dev',
    avatar: '🕹️',
    subscribers: '50K',
    highlight: '20K wishlists from email alone',
    stats: [
      { label: 'Email List Size', value: '20K', icon: Mail },
      { label: 'Wishlist Conversions', value: '68%', icon: TrendingUp },
      { label: 'Launch Day Sales', value: '8.5K', icon: DollarSign },
      { label: 'Community Size', value: '5K', icon: Users },
    ],
    story:
      'This indie game developer used EEC to build a dedicated email audience before their game launch. By sharing behind-the-scenes development updates and exclusive previews through their newsletter, they created massive anticipation that translated directly into day-one sales.',
    results: [
      'Grew email list from 0 to 20K in 6 months',
      'Achieved 68% wishlist conversion from email subscribers',
      'Generated 8,500 sales on launch day',
      'Built a loyal community of beta testers and advocates',
    ],
  },
  {
    title: 'Esports Coach Monetizes Expertise',
    game: 'Valorant',
    avatar: '🏆',
    subscribers: '200K',
    highlight: '$8K/month from coaching pipeline',
    stats: [
      { label: 'Email List Size', value: '30K', icon: Mail },
      { label: 'Monthly Revenue', value: '$8K', icon: DollarSign },
      { label: 'Booking Rate', value: '35%', icon: TrendingUp },
      { label: 'Students Coached', value: '500+', icon: Users },
    ],
    story:
      'A Valorant content creator and former pro player used EEC to build an automated coaching pipeline. Their weekly tips newsletter funnel converts subscribers into paid coaching sessions, creating a sustainable business beyond content creation.',
    results: [
      'Automated lead generation through email sequences',
      'Reduced client acquisition cost to near zero',
      'Created a waiting list of 200+ students',
      'Diversified income across coaching, courses, and content',
    ],
  },
];

export default function CaseStudiesPage() {
  return (
    <PageLayout
      title={<>Case <span className="text-gradient">Studies</span></>}
      subtitle="Real results from gaming creators who stopped relying on the algorithm and started owning their audience."
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="max-w-5xl mx-auto space-y-16">
          {caseStudies.map((study, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-[#1a1a1a] rounded-2xl border border-white/10 overflow-hidden"
            >
              {/* Header */}
              <div className="p-8 border-b border-white/5">
                <div className="flex items-start gap-4 mb-4">
                  <span className="text-4xl">{study.avatar}</span>
                  <div>
                    <h2 className="text-2xl font-bold mb-1">{study.title}</h2>
                    <div className="flex items-center gap-3 text-sm text-[#a0a0a0]">
                      <span>{study.game}</span>
                      <span className="w-1 h-1 rounded-full bg-[#666]" />
                      <span>{study.subscribers} subscribers</span>
                    </div>
                  </div>
                </div>
                <span className="inline-block px-4 py-1.5 rounded-full bg-[#00ff88]/10 text-[#00ff88] text-sm font-medium">
                  {study.highlight}
                </span>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 border-b border-white/5">
                {study.stats.map((stat, sIndex) => (
                  <div key={sIndex} className="p-6 text-center border-r border-white/5 last:border-r-0">
                    <stat.icon className="w-5 h-5 text-[#00ff88] mx-auto mb-2" />
                    <p className="text-2xl font-bold mb-1">{stat.value}</p>
                    <p className="text-xs text-[#666]">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Story & Results */}
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Quote className="w-4 h-4 text-[#00ff88]" />
                    The Story
                  </h3>
                  <p className="text-[#a0a0a0] leading-relaxed">{study.story}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Key Results</h3>
                  <ul className="space-y-3">
                    {study.results.map((result, rIndex) => (
                      <li key={rIndex} className="flex items-start gap-3 text-[#a0a0a0]">
                        <ArrowRight className="w-4 h-4 text-[#00ff88] mt-0.5 flex-shrink-0" />
                        <span>{result}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}

          {/* CTA */}
          <div className="text-center pt-8">
            <p className="text-[#a0a0a0] mb-6">Ready to write your own success story?</p>
            <Link
              to="/#cta"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#00ff88] to-[#00d4aa] text-[#0a0a0a] font-bold hover:opacity-90 transition-opacity"
            >
              Get Started Today
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

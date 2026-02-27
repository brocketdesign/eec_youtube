import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Video, Calendar, Clock, Users, ArrowRight, Play } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';

const upcomingWebinars = [
  {
    title: 'Email List Building Masterclass for Gaming Creators',
    date: 'March 15, 2026',
    time: '2:00 PM EST',
    host: 'EEC Team',
    attendees: '340 registered',
    description:
      'Learn the exact strategies top gaming creators use to build their first 10,000 email subscribers. Live Q&A included.',
    topics: ['Lead magnets for gamers', 'YouTube-to-email funnels', 'Opt-in form placement'],
  },
  {
    title: 'Monetization Workshop: 7 Revenue Streams from Email',
    date: 'March 28, 2026',
    time: '3:00 PM EST',
    host: 'EEC Team',
    attendees: '210 registered',
    description:
      'Discover seven proven ways to generate income from your gaming newsletter — beyond sponsorships.',
    topics: ['Premium newsletters', 'Merch integration', 'Affiliate strategies'],
  },
];

const pastWebinars = [
  {
    title: 'The Algorithm-Proof Creator: Building on Email',
    date: 'February 10, 2026',
    attendees: '520 attended',
    description: 'Why the smartest gaming creators are going all-in on email — and how you can start today.',
  },
  {
    title: 'Welcome Sequences That Convert: Live Teardown',
    date: 'January 25, 2026',
    attendees: '430 attended',
    description: 'We reviewed real welcome sequences from gaming creators and optimized them live.',
  },
  {
    title: 'Community Building: Email + Discord Integration',
    date: 'January 10, 2026',
    attendees: '380 attended',
    description: 'How to create a seamless community ecosystem using email and Discord together.',
  },
  {
    title: 'Newsletter Writing Workshop for Gamers',
    date: 'December 15, 2025',
    attendees: '290 attended',
    description: 'Hands-on workshop covering newsletter structure, storytelling, and engagement tactics.',
  },
];

export default function WebinarsPage() {
  return (
    <PageLayout
      title={<>Live <span className="text-gradient">Webinars</span></>}
      subtitle="Free live sessions to help you master email marketing for your gaming audience."
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="max-w-5xl mx-auto">
          {/* Upcoming Webinars */}
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-[#00ff88] animate-pulse" />
            Upcoming Webinars
          </h2>
          <div className="space-y-6 mb-16">
            {upcomingWebinars.map((webinar, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#1a1a1a] rounded-2xl border border-[#00ff88]/20 p-8 hover:border-[#00ff88]/40 transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-3">{webinar.title}</h3>
                    <p className="text-[#a0a0a0] mb-4">{webinar.description}</p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-[#666] mb-4">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        {webinar.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {webinar.time}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users className="w-4 h-4" />
                        {webinar.attendees}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {webinar.topics.map((topic, tIndex) => (
                        <span key={tIndex} className="text-xs px-3 py-1 rounded-lg bg-white/5 text-[#a0a0a0]">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link
                    to="/#cta"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#00ff88] to-[#00d4aa] text-[#0a0a0a] font-bold hover:opacity-90 transition-opacity whitespace-nowrap"
                  >
                    Register Free
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Past Webinars */}
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <Play className="w-5 h-5 text-[#a0a0a0]" />
            Past Webinars
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {pastWebinars.map((webinar, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#1a1a1a] rounded-2xl border border-white/10 p-6 hover:border-[#00ff88]/20 transition-all duration-300 group cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-[#00ff88]/10 transition-colors">
                    <Video className="w-5 h-5 text-[#a0a0a0] group-hover:text-[#00ff88] transition-colors" />
                  </div>
                  <div>
                    <p className="text-xs text-[#666]">{webinar.date}</p>
                    <p className="text-xs text-[#666]">{webinar.attendees}</p>
                  </div>
                </div>
                <h3 className="font-bold mb-2 group-hover:text-[#00ff88] transition-colors">
                  {webinar.title}
                </h3>
                <p className="text-sm text-[#a0a0a0]">{webinar.description}</p>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 p-8 lg:p-12 text-center">
            <Video className="w-10 h-10 text-[#00ff88] mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-3">Never miss a webinar</h2>
            <p className="text-[#a0a0a0] mb-6 max-w-md mx-auto">
              Join our mailing list to get notified about upcoming live sessions and receive recordings of past webinars.
            </p>
            <Link
              to="/#cta"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#00ff88] to-[#00d4aa] text-[#0a0a0a] font-bold hover:opacity-90 transition-opacity"
            >
              Get Notified
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

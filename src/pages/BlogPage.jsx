import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Tag, ArrowRight, BookOpen } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';

const posts = [
  {
    title: 'Why Every Gaming Creator Needs an Email List in 2026',
    excerpt:
      'YouTube subscribers don\'t belong to you. Here\'s why the smartest gaming creators are building email lists — and how you can start today.',
    category: 'Strategy',
    readTime: '8 min read',
    date: 'Feb 25, 2026',
    featured: true,
  },
  {
    title: '5 Email Welcome Sequences That Convert Viewers to Fans',
    excerpt:
      'Your welcome sequence is your first impression. These 5 proven templates will help you turn new subscribers into loyal community members.',
    category: 'Templates',
    readTime: '6 min read',
    date: 'Feb 20, 2026',
  },
  {
    title: 'How to Monetize Your Gaming Newsletter (Without Sponsorships)',
    excerpt:
      'Sponsorships aren\'t the only way to make money from email. Discover 7 revenue streams gaming creators are using right now.',
    category: 'Monetization',
    readTime: '10 min read',
    date: 'Feb 15, 2026',
  },
  {
    title: 'The Algorithm-Proof Content Strategy for Gaming Creators',
    excerpt:
      'Stop letting algorithm changes dictate your income. Build a content strategy that works regardless of what YouTube or Twitch does next.',
    category: 'Strategy',
    readTime: '7 min read',
    date: 'Feb 10, 2026',
  },
  {
    title: 'Email Subject Lines That Get 40%+ Open Rates in Gaming',
    excerpt:
      'We analyzed 10,000 gaming newsletters to find what works. Here are the top-performing subject line formulas with real examples.',
    category: 'Tips',
    readTime: '5 min read',
    date: 'Feb 5, 2026',
  },
  {
    title: 'Building a Community: Discord + Email Integration Guide',
    excerpt:
      'Email and Discord are better together. Learn how to create a seamless ecosystem that keeps your community engaged across platforms.',
    category: 'Guides',
    readTime: '12 min read',
    date: 'Jan 30, 2026',
  },
];

const categoryColors = {
  Strategy: 'bg-blue-500/10 text-blue-400',
  Templates: 'bg-purple-500/10 text-purple-400',
  Monetization: 'bg-[#00ff88]/10 text-[#00ff88]',
  Tips: 'bg-yellow-500/10 text-yellow-400',
  Guides: 'bg-cyan-500/10 text-cyan-400',
};

export default function BlogPage() {
  return (
    <PageLayout
      title={<>The EEC <span className="text-gradient">Blog</span></>}
      subtitle="Strategies, tips, and insights for gaming creators building email-powered businesses."
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="max-w-5xl mx-auto">
          {/* Featured Post */}
          {posts.filter(p => p.featured).map((post, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#1a1a1a] rounded-2xl border border-[#00ff88]/20 p-8 lg:p-12 mb-12 cursor-pointer hover:border-[#00ff88]/40 transition-all duration-300"
            >
              <span className="text-xs font-medium text-[#00ff88] uppercase tracking-wider mb-4 block">
                Featured Article
              </span>
              <h2 className="text-2xl lg:text-3xl font-bold mb-4">{post.title}</h2>
              <p className="text-[#a0a0a0] text-lg mb-6 leading-relaxed">{post.excerpt}</p>
              <div className="flex items-center gap-4 text-sm text-[#666]">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[post.category]}`}>
                  {post.category}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {post.readTime}
                </span>
                <span>{post.date}</span>
              </div>
            </motion.div>
          ))}

          {/* Post Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {posts.filter(p => !p.featured).map((post, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#1a1a1a] rounded-2xl border border-white/10 p-6 cursor-pointer hover:border-[#00ff88]/20 transition-all duration-300 group"
              >
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${categoryColors[post.category]}`}>
                  {post.category}
                </span>
                <h3 className="text-lg font-bold mb-3 group-hover:text-[#00ff88] transition-colors">
                  {post.title}
                </h3>
                <p className="text-[#a0a0a0] text-sm mb-4 leading-relaxed">{post.excerpt}</p>
                <div className="flex items-center gap-4 text-xs text-[#666]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </span>
                  <span>{post.date}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Newsletter CTA */}
          <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 p-8 lg:p-12 text-center">
            <BookOpen className="w-10 h-10 text-[#00ff88] mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-3">Never miss an article</h2>
            <p className="text-[#a0a0a0] mb-6 max-w-md mx-auto">
              Get the latest strategies and tips delivered straight to your inbox. Join 10,000+ gaming creators.
            </p>
            <Link
              to="/#cta"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#00ff88] to-[#00d4aa] text-[#0a0a0a] font-bold hover:opacity-90 transition-opacity"
            >
              Subscribe Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Quote, ArrowRight } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';

const testimonials = [
  {
    name: 'Alex "ProBlitz" Chen',
    role: 'Fortnite Creator',
    subscribers: '500K subscribers',
    avatar: '🎮',
    rating: 5,
    quote:
      'EEC completely changed how I think about my audience. I went from worrying about every algorithm update to having a direct line to 45K fans who actually open my emails. My revenue is 30x what it was.',
    highlight: '$500 → $15K/month',
  },
  {
    name: 'Sarah Williams',
    role: 'Indie Game Developer',
    subscribers: '50K subscribers',
    avatar: '🕹️',
    rating: 5,
    quote:
      'I used EEC to build my pre-launch audience from scratch. The email sequences and templates made it easy to keep my community engaged during development. Launch day was incredible — 8,500 sales, mostly from my email list.',
    highlight: '8,500 launch day sales',
  },
  {
    name: 'Marcus "ValorKing" Johnson',
    role: 'Valorant Coach & Creator',
    subscribers: '200K subscribers',
    avatar: '🏆',
    rating: 5,
    quote:
      'The coaching pipeline I built with EEC runs itself. My newsletter brings in new coaching clients every week without me spending a dime on ads. I went from chasing sponsorships to having a waitlist.',
    highlight: '200+ student waitlist',
  },
  {
    name: 'Emily Park',
    role: 'Gaming Lifestyle Creator',
    subscribers: '150K subscribers',
    avatar: '✨',
    rating: 5,
    quote:
      'I was skeptical about email for gaming content, but EEC showed me how to make it work. My newsletter has a 45% open rate and my merch drops sell out in hours because I announce to my email list first.',
    highlight: '45% open rate',
  },
  {
    name: 'David "PixelMaster" Torres',
    role: 'Minecraft Builder & Educator',
    subscribers: '300K subscribers',
    avatar: '⛏️',
    rating: 5,
    quote:
      'EEC helped me turn my Minecraft tutorials into a real education business. I now sell premium build guides through my newsletter and make more from email than YouTube ad revenue. The community support is amazing.',
    highlight: '3x YouTube ad revenue',
  },
  {
    name: 'Yuki Tanaka',
    role: 'Speedrunner & Streamer',
    subscribers: '80K subscribers',
    avatar: '⚡',
    rating: 4,
    quote:
      'As a speedrunner, my content is super niche. EEC helped me find and engage the exact audience that cares about what I do. My email list is smaller but incredibly engaged — these are my true fans.',
    highlight: '52% click-through rate',
  },
];

export default function TestimonialsPage() {
  return (
    <PageLayout
      title={<>What Creators <span className="text-gradient">Say</span></>}
      subtitle="Hear from gaming creators who transformed their businesses with EEC."
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="max-w-6xl mx-auto">
          {/* Testimonial Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-[#1a1a1a] rounded-2xl border border-white/10 p-8 hover:border-[#00ff88]/20 transition-all duration-300"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{testimonial.avatar}</span>
                    <div>
                      <h3 className="font-bold">{testimonial.name}</h3>
                      <p className="text-sm text-[#a0a0a0]">{testimonial.role}</p>
                      <p className="text-xs text-[#666]">{testimonial.subscribers}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#00ff88] text-[#00ff88]" />
                    ))}
                  </div>
                </div>

                {/* Quote */}
                <div className="relative mb-6">
                  <Quote className="absolute -top-2 -left-1 w-8 h-8 text-[#00ff88]/10" />
                  <p className="text-[#a0a0a0] leading-relaxed pl-4 italic">
                    "{testimonial.quote}"
                  </p>
                </div>

                {/* Highlight */}
                <div className="inline-block px-4 py-1.5 rounded-full bg-[#00ff88]/10 text-[#00ff88] text-sm font-medium">
                  {testimonial.highlight}
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <p className="text-[#a0a0a0] mb-6">Ready to join these creators?</p>
            <Link
              to="/#cta"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#00ff88] to-[#00d4aa] text-[#0a0a0a] font-bold hover:opacity-90 transition-opacity"
            >
              Start Building Your Audience
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

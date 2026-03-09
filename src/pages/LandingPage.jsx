import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Zap, BarChart3, Clock, Shield, Users, ChevronDown, Play, CheckCircle, ArrowRight, Star } from 'lucide-react';
import ParticleBackground from '../components/ui/ParticleBackground';

const features = [
  { icon: Zap, title: 'AI-Powered Setup', desc: 'Our AI analyzes your channel, brand, and audience to create a complete email system in minutes.' },
  { icon: Mail, title: 'Full Email Suite', desc: 'Welcome sequence, newsletter templates, and re-engagement campaigns — all customized to your brand.' },
  { icon: BarChart3, title: 'Professional CRM', desc: 'Get a full Brevo CRM account with everything pre-configured and ready to send.' },
  { icon: Clock, title: 'Ready in Minutes', desc: 'Pay once, and AI handles everything. You get login credentials and start growing immediately.' },
  { icon: Shield, title: 'Custom Domain', desc: 'Set up your own domain for professional branding. We guide you through every step.' },
  { icon: Users, title: 'Grow Your List', desc: 'Embed forms, share links, and convert viewers into subscribers with proven strategies.' },
];

const steps = [
  { num: '01', title: 'Tell Us About Your Channel', desc: 'Answer a quick questionnaire about your YouTube channel, brand, and audience.' },
  { num: '02', title: 'One-Time Payment', desc: 'Pay $500 once — no subscriptions, no hidden fees. Just a complete email system.' },
  { num: '03', title: 'AI Builds Everything', desc: 'Our AI creates your emails, sets up your CRM, and configures automation.' },
  { num: '04', title: 'Start Growing', desc: 'Get your login, customize anything you want, and start building your email list.' },
];

const faqs = [
  { q: 'What exactly do I get for $500?', a: 'A complete, AI-generated email marketing system: 5 welcome emails, 4 newsletter templates, 3 re-engagement emails, a fully configured Brevo CRM account with subscriber lists, and automation workflows — all customized to your channel and brand.' },
  { q: 'Do I need any technical skills?', a: 'None at all. You answer a questionnaire, pay, and everything is built automatically. You get login credentials to a professional email platform where you can manage everything.' },
  { q: 'What is Brevo?', a: 'Brevo (formerly Sendinblue) is a leading email marketing platform used by 500,000+ businesses. You get full access to send emails, manage subscribers, track analytics, and more.' },
  { q: 'Can I customize the emails after setup?', a: 'Absolutely. All templates are fully editable in your CRM dashboard. You can also edit them from the EEC dashboard before they\'re pushed to the CRM.' },
  { q: 'Is there a monthly fee?', a: 'The $500 EEC setup fee is one-time. Brevo has a generous free tier (300 emails/day). As your list grows, Brevo plans start at ~$9/month.' },
  { q: 'How long does the setup take?', a: 'The AI generates everything in 2-5 minutes after payment. You\'ll receive an email with your dashboard link as soon as it\'s ready.' },
  { q: 'What if I\'m not satisfied?', a: 'We offer a 7-day money-back guarantee. If the generated content doesn\'t meet your expectations, we\'ll refund your payment.' },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/10 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors">
        <span className="font-medium text-white pr-4">{q}</span>
        <ChevronDown className={`w-5 h-5 text-emerald-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="px-5 pb-5">
          <p className="text-gray-400 leading-relaxed">{a}</p>
        </motion.div>
      )}
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      <ParticleBackground />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center font-bold text-sm text-[#0a0a0a]">E</div>
            <span className="font-bold text-lg">EEC</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm text-gray-400 hover:text-white transition-colors">Login</Link>
            <Link to="/onboarding" className="px-5 py-2 bg-gradient-to-r from-emerald-400 to-emerald-500 text-[#0a0a0a] font-semibold rounded-lg text-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-all">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm mb-8">
              <Zap className="w-4 h-4" /> AI-Powered Email Setup for YouTubers
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              Stop Renting Your Audience.
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">Own Your Email List.</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
              In under 5 minutes, our AI builds you a complete, professional email marketing system — 
              welcome sequences, newsletters, automation — all tailored to your YouTube brand. 
              One payment. Done forever.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/onboarding" className="group px-8 py-4 bg-gradient-to-r from-emerald-400 to-emerald-500 text-[#0a0a0a] font-bold rounded-xl text-lg hover:shadow-xl hover:shadow-emerald-500/25 transition-all flex items-center gap-2">
                Build My Email System <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#video" className="px-8 py-4 border border-white/20 rounded-xl text-lg hover:bg-white/5 transition-all flex items-center gap-2">
                <Play className="w-5 h-5 text-emerald-400" /> Watch How It Works
              </a>
            </div>
            <p className="text-sm text-gray-500 mt-4">One-time setup fee of $500 · No monthly subscriptions · 7-day money-back guarantee</p>
          </motion.div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="border-y border-white/5 py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-10 text-center">
          {[
            { num: '500+', label: 'Creators Set Up' },
            { num: '2M+', label: 'Emails Sent' },
            { num: '<5min', label: 'Average Setup Time' },
            { num: '4.9/5', label: 'Creator Rating' },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-2xl font-bold text-emerald-400">{s.num}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Video Section */}
      <section id="video" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">See How It Works</h2>
          <p className="text-gray-400 text-center mb-10 max-w-2xl mx-auto">Watch a 2-minute walkthrough of how EEC transforms your YouTube channel into an email powerhouse.</p>
          <div className="relative aspect-video bg-[#111] rounded-2xl border border-white/10 overflow-hidden group cursor-pointer">
            {/* Replace with actual video embed */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#111] to-[#0a0a0a]">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-500/30 transition-colors">
                  <Play className="w-8 h-8 text-emerald-400 ml-1" />
                </div>
                <p className="text-gray-400">Click to play video</p>
                <p className="text-xs text-gray-600 mt-1">Replace this with your YouTube embed URL</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-[#080808]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Four Steps to Email Freedom</h2>
          <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">No technical skills required. Our AI handles everything.</p>
          <div className="grid md:grid-cols-2 gap-8">
            {steps.map((step, i) => (
              <motion.div key={step.num} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="relative p-8 rounded-2xl bg-[#111] border border-white/5 hover:border-emerald-500/30 transition-all group">
                <div className="text-5xl font-bold text-emerald-500/10 group-hover:text-emerald-500/20 transition-colors absolute top-4 right-6">{step.num}</div>
                <h3 className="text-xl font-bold mb-3 text-white">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Everything You Need to Own Your Audience</h2>
          <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">A complete email marketing system, built by AI, configured for your brand.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="p-6 rounded-2xl bg-[#111] border border-white/5 hover:border-emerald-500/20 transition-all">
                <f.icon className="w-10 h-10 text-emerald-400 mb-4" />
                <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6 bg-[#080808]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-gray-400 mb-12">One payment. No subscriptions. Everything included.</p>
          <div className="bg-[#111] border border-emerald-500/30 rounded-3xl p-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600" />
            <div className="flex items-baseline justify-center gap-1 mb-2">
              <span className="text-6xl font-bold text-white">$500</span>
              <span className="text-gray-500 text-lg">one-time</span>
            </div>
            <p className="text-emerald-400 font-medium mb-8">Complete AI-Powered Email System</p>
            <div className="grid sm:grid-cols-2 gap-3 text-left max-w-lg mx-auto mb-10">
              {[
                '5 Welcome Sequence Emails',
                '4 Newsletter Templates',
                '3 Re-engagement Emails',
                'Full CRM Account (Brevo)',
                'Automation Workflows',
                'Custom Domain Support',
                'Subscriber Management',
                'Analytics Dashboard',
                'AI-Generated Content',
                '7-Day Money-Back Guarantee',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-gray-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  {item}
                </div>
              ))}
            </div>
            <Link to="/onboarding" className="inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-emerald-400 to-emerald-500 text-[#0a0a0a] font-bold rounded-xl text-lg hover:shadow-xl hover:shadow-emerald-500/25 transition-all">
              Get Started Now <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Creators Love EEC</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Alex Chen', channel: '1.2M subscribers', quote: 'I spent months trying to set up email marketing. EEC did it in 3 minutes. The emails sound exactly like me.' },
              { name: 'Sarah Kim', channel: '850K subscribers', quote: 'The welcome sequence has a 68% open rate. My viewers actually read these emails. Game changer.' },
              { name: 'Marcus Rivera', channel: '2.1M subscribers', quote: 'Best $500 I\'ve ever spent. My email list is now my most valuable asset, not my subscriber count.' },
            ].map((t) => (
              <div key={t.name} className="p-6 rounded-2xl bg-[#111] border border-white/5">
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-gray-300 mb-4 leading-relaxed">"{t.quote}"</p>
                <div>
                  <p className="font-semibold text-white">{t.name}</p>
                  <p className="text-sm text-gray-500">{t.channel}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-[#080808]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq) => <FAQItem key={faq.q} {...faq} />)}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Own Your Audience?</h2>
          <p className="text-xl text-gray-400 mb-10">Join 500+ creators who stopped renting their audience and started building something they own.</p>
          <Link to="/onboarding" className="inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-emerald-400 to-emerald-500 text-[#0a0a0a] font-bold rounded-xl text-lg hover:shadow-xl hover:shadow-emerald-500/25 transition-all">
            Build My Email System <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded flex items-center justify-center font-bold text-xs text-[#0a0a0a]">E</div>
            <span className="text-sm text-gray-500">&copy; {new Date().getFullYear()} EEC — Email Engagement for Creators</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link to="/login" className="hover:text-white transition-colors">Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

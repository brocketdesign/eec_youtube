import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Calendar, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import Button from '../ui/Button';

const API_URL = import.meta.env.VITE_API_URL || '';

const FinalCTA = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/send-playbook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send email');
      }

      // Redirect to success page
      navigate(`/success?email=${encodeURIComponent(email)}`);
    } catch (err) {
      console.error('Error sending playbook:', err);
      setError(err.message || 'Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <section id="cta" className="section py-24 lg:py-32 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00ff88]/5 rounded-full blur-[150px]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="section-title mb-4">
              Ready to <span className="text-gradient">Own Your Audience?</span>
            </h2>
            <p className="section-subtitle">
              Join the gaming creators who are building real businesses, not just
              renting audiences from platforms.
            </p>
          </motion.div>

          {/* Two Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Option 1: Free Playbook */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-[#1a1a1a] rounded-2xl border border-white/10 p-8 hover:border-[#00ff88]/30 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-[#00ff88]/10 flex items-center justify-center mb-6">
                <Mail className="w-7 h-7 text-[#00ff88]" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Get the Free EEC Playbook</h3>
              <p className="text-[#a0a0a0] mb-6">
                The exact framework we use to help gaming creators build 6-figure
                email lists. 47 pages of actionable strategies.
              </p>

              {isSubmitting ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-3 text-[#00ff88] bg-[#00ff88]/10 rounded-lg p-4"
                >
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="font-medium">Sending your playbook...</span>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    placeholder="Enter your email"
                    required
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-lg text-white placeholder-[#666] focus:outline-none focus:border-[#00ff88] transition-colors"
                  />
                  {error && (
                    <p className="text-red-400 text-sm">{error}</p>
                  )}
                  <Button type="submit" className="w-full">
                    Send Me The Playbook
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </form>
              )}

              <p className="text-xs text-[#666] mt-4">
                No spam. Unsubscribe anytime. We respect your privacy.
              </p>
            </motion.div>

            {/* Option 2: Book Call */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-gradient-to-br from-[#1a1a1a] to-[#222] rounded-2xl border border-[#00ff88]/30 p-8 relative overflow-hidden"
            >
              {/* Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ff88]/10 rounded-full blur-3xl" />

              <div className="relative z-10">
                <div className="w-14 h-14 rounded-xl bg-[#00ff88]/10 flex items-center justify-center mb-6">
                  <Calendar className="w-7 h-7 text-[#00ff88]" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Book a 15-Min Call</h3>
                <p className="text-[#a0a0a0] mb-6">
                  Let&apos;s discuss your channel and see if EEC is the right fit.
                  No pressure, just a conversation about your goals.
                </p>

                <div className="space-y-4 mb-8">
                  {[
                    'Free channel audit',
                    'Custom strategy outline',
                    'Q&A about the process',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-[#00ff88] flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  variant="primary" 
                  className="w-full animate-pulse-glow"
                  onClick={() => navigate('/book')}
                >
                  Schedule My Call
                  <ArrowRight className="w-4 h-4" />
                </Button>

                <p className="text-xs text-[#666] mt-4">
                  Limited spots available. Next opening: 3 days from now.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-8 text-[#666] text-sm"
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#00ff88]" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#00ff88]" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#00ff88]" />
              <span>100% satisfaction guarantee</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;

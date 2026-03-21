import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Youtube, ArrowRight, Loader2, CheckCircle2, Sparkles } from 'lucide-react';
import { api } from '../../lib/api';

const STORAGE_KEY = 'eec_newsletter_dismissed';
const POPUP_DELAY_MS = 15000; // Show after 15 seconds

export default function NewsletterPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [channelUrl, setChannelUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [heroImage, setHeroImage] = useState(null);

  useEffect(() => {
    // Don't show if already dismissed or subscribed
    if (localStorage.getItem(STORAGE_KEY)) return;

    const timer = setTimeout(() => setVisible(true), POPUP_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  // Try to load Grok-generated hero image
  useEffect(() => {
    if (!visible) return;
    api.getNewsletterHeroImage()
      .then((data) => setHeroImage(data.imageUrl))
      .catch(() => {}); // Silently fail — fallback gradient is fine
  }, [visible]);

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, 'dismissed');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email) return setError('Email is required');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError('Enter a valid email');

    setLoading(true);
    try {
      await api.subscribeNewsletter({ email, channelUrl });
      setSuccess(true);
      localStorage.setItem(STORAGE_KEY, 'subscribed');
      setTimeout(() => setVisible(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleDismiss}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-lg bg-[#111] border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-emerald-500/10">
              {/* Close button */}
              <button
                onClick={handleDismiss}
                className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Hero image / gradient banner */}
              <div className="relative h-40 overflow-hidden">
                {heroImage ? (
                  <img src={heroImage} alt="Newsletter" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-emerald-600/40 via-emerald-500/20 to-[#111]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent" />
                <div className="absolute bottom-4 left-6">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
                    <Sparkles className="w-3 h-3" /> Free Insights
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 pb-6 pt-2">
                {success ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-8"
                  >
                    <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">You're In! 🎉</h3>
                    <p className="text-gray-400 text-sm">Check your inbox for exclusive creator tips and strategies.</p>
                  </motion.div>
                ) : (
                  <>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Don't Leave Money on the Table
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-5">
                      Not ready to start yet? No worries. Join our newsletter and get 
                      <span className="text-emerald-400 font-medium"> free weekly tips</span> on how 
                      top creators turn subscribers into revenue with email marketing. 
                      Close the gap before your competitors do.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-3">
                      {/* Email */}
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-emerald-500/50 transition-colors text-sm"
                        />
                      </div>

                      {/* YouTube Channel */}
                      <div className="relative">
                        <Youtube className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                          type="url"
                          value={channelUrl}
                          onChange={(e) => setChannelUrl(e.target.value)}
                          placeholder="https://youtube.com/@yourchannel (optional)"
                          className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-emerald-500/50 transition-colors text-sm"
                        />
                      </div>

                      {error && (
                        <p className="text-red-400 text-xs px-1">{error}</p>
                      )}

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-emerald-400 to-emerald-500 text-[#0a0a0a] font-bold rounded-xl text-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            Get Free Creator Tips <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </form>

                    <p className="text-[11px] text-gray-600 text-center mt-3">
                      No spam. Unsubscribe anytime. We respect your privacy.
                    </p>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

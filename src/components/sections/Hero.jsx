import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Zap } from 'lucide-react';
import Button from '../ui/Button';
import AnimatedCounter from '../ui/AnimatedCounter';
import { useSmoothScroll } from '../../hooks/useSmoothScroll';

const Hero = () => {
  const { scrollToSection } = useSmoothScroll();
  const [counterIndex, setCounterIndex] = useState(0);

  const counters = [
    { value: 32800000, prefix: '', suffix: '', label: 'Subscribers', formatter: (v) => `${(v / 1000000).toFixed(1)}M` },
    { value: 0.04, prefix: '', suffix: '%', label: 'Engagement Rate', formatter: (v) => v.toFixed(2) },
    { value: 3600, prefix: '', suffix: '%', label: 'Email ROI', formatter: (v) => v.toLocaleString() },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCounterIndex((prev) => (prev + 1) % counters.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Grid */}
      <div className="absolute inset-0 grid-pattern opacity-50" />
      
      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00ff88]/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00d4aa]/10 rounded-full blur-[120px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#ff6b35]/5 rounded-full blur-[150px]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00ff88]/10 border border-[#00ff88]/20 mb-8"
          >
            <Zap className="w-4 h-4 text-[#00ff88]" />
            <span className="text-sm font-medium text-[#00ff88]">Built for 1M+ Gaming Creators</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
          >
            Own Your Fans.
            <br />
            <span className="text-gradient">Don&apos;t Rent Them.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-[#a0a0a0] max-w-2xl mx-auto mb-10"
          >
            YouTube can change the algorithm. Your email list is yours forever.
            Turn viewers into a community you actually own.
          </motion.p>

          {/* Animated Counter */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-10"
          >
            <div className="inline-flex flex-col items-center bg-[#1a1a1a] rounded-2xl border border-white/10 p-6 sm:p-8">
              <div className="h-16 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={counterIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="text-center"
                  >
                    <div className="text-4xl sm:text-5xl font-bold text-gradient">
                      {counterIndex === 0 && (
                        <AnimatedCounter 
                          value={32800000} 
                          formatter={(v) => `${(v / 1000000).toFixed(1)}M`}
                          className="text-gradient"
                        />
                      )}
                      {counterIndex === 1 && (
                        <AnimatedCounter 
                          value={0.04} 
                          suffix="%"
                          formatter={(v) => v.toFixed(2)}
                          className="text-[#ff6b35]"
                        />
                      )}
                      {counterIndex === 2 && (
                        <AnimatedCounter 
                          value={3600} 
                          suffix="%"
                          className="text-gradient"
                        />
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="flex items-center gap-2 mt-2">
                {counters.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCounterIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      idx === counterIndex ? 'w-6 bg-[#00ff88]' : 'bg-white/20'
                    }`}
                  />
                ))}
              </div>
              <p className="text-[#a0a0a0] text-sm mt-3">
                {counters[counterIndex].label}
              </p>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button 
              size="lg" 
              className="animate-pulse-glow"
              onClick={() => scrollToSection('cta')}
            >
              Get Early Access
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => scrollToSection('solution')}
            >
              See How It Works
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-6 text-[#666] text-sm"
          >
            <span>Trusted by creators from</span>
            <div className="flex items-center gap-4">
              <span className="text-white/60 font-medium">Fortnite</span>
              <span className="w-1 h-1 rounded-full bg-[#666]" />
              <span className="text-white/60 font-medium">GTA</span>
              <span className="w-1 h-1 rounded-full bg-[#666]" />
              <span className="text-white/60 font-medium">Minecraft</span>
              <span className="w-1 h-1 rounded-full bg-[#666]" />
              <span className="text-white/60 font-medium">Call of Duty</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2"
        >
          <div className="w-1 h-2 rounded-full bg-[#00ff88]" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;

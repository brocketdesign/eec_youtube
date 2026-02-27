import { motion } from 'framer-motion';
import { TrendingDown, TrendingUp, Quote } from 'lucide-react';
import AnimatedCounter from '../ui/AnimatedCounter';

const CaseStudy = () => {
  return (
    <section className="section py-24 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-title mb-4">
            How a <span className="text-gradient">500K Gaming Channel</span>{' '}
            Transformed Their Business
          </h2>
          <p className="section-subtitle">
            Real results from a Fortnite creator who stopped relying on the algorithm
            and started owning their audience.
          </p>
        </motion.div>

        {/* Before/After Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {/* Before */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-[#1a1a1a] rounded-2xl border border-[#ff6b35]/30 p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff6b35]/10 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#ff6b35]/10 flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-[#ff6b35]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#ff6b35]">Before EEC</h3>
                  <p className="text-sm text-[#666]">Platform-dependent</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-[#a0a0a0] text-sm mb-2">Average Video Views</p>
                  <p className="text-3xl font-bold text-white">
                    <AnimatedCounter value={100} suffix="K" />
                  </p>
                </div>
                <div>
                  <p className="text-[#a0a0a0] text-sm mb-2">Monthly Ad Revenue</p>
                  <p className="text-3xl font-bold text-white">
                    <AnimatedCounter value={500} prefix="$" />
                  </p>
                </div>
                <div>
                  <p className="text-[#a0a0a0] text-sm mb-2">Audience Control</p>
                  <p className="text-xl font-bold text-[#ff6b35]">0%</p>
                  <p className="text-sm text-[#666]">YouTube owns everything</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* After */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-[#1a1a1a] rounded-2xl border border-[#00ff88]/30 p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ff88]/10 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#00ff88]/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-[#00ff88]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#00ff88]">After EEC</h3>
                  <p className="text-sm text-[#666]">Audience-owned</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-[#a0a0a0] text-sm mb-2">Email List Size</p>
                  <p className="text-3xl font-bold text-gradient">
                    <AnimatedCounter value={50} suffix="K" />
                  </p>
                </div>
                <div>
                  <p className="text-[#a0a0a0] text-sm mb-2">Product Launch Revenue</p>
                  <p className="text-3xl font-bold text-gradient">
                    <AnimatedCounter value={25000} prefix="$" />
                  </p>
                </div>
                <div>
                  <p className="text-[#a0a0a0] text-sm mb-2">Audience Control</p>
                  <p className="text-xl font-bold text-[#00ff88]">100%</p>
                  <p className="text-sm text-[#666]">You own the relationship</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-3xl mx-auto"
        >
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#222] rounded-2xl border border-[#00ff88]/20 p-8 md:p-12 relative">
            <Quote className="absolute top-6 left-6 w-12 h-12 text-[#00ff88]/20" />
            
            <blockquote className="relative z-10 text-lg md:text-xl text-center leading-relaxed mb-8">
              &ldquo;I used to panic every time YouTube announced an algorithm update.
              Now? I sleep soundly knowing my 50,000 email subscribers are{' '}
              <span className="text-[#00ff88] font-semibold">mine</span>. My last
              product launch made more in a weekend than 3 months of ad revenue.&rdquo;
            </blockquote>

            <div className="flex items-center justify-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#00ff88] to-[#00d4aa] flex items-center justify-center text-[#0a0a0a] font-bold text-xl">
                A
              </div>
              <div className="text-left">
                <p className="font-semibold">Alex Chen</p>
                <p className="text-sm text-[#a0a0a0]">Fortnite Creator • 520K Subscribers</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CaseStudy;

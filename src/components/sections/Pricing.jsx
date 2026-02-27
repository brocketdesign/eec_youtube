import { motion } from 'framer-motion';
import { Check, Shield, Clock, Zap } from 'lucide-react';
import Button from '../ui/Button';
import { useSmoothScroll } from '../../hooks/useSmoothScroll';

const Pricing = () => {
  const { scrollToSection } = useSmoothScroll();

  const features = [
    'Complete email strategy audit',
    'Lead magnet creation (2 magnets)',
    'Email platform setup & integration',
    'Welcome sequence (5 emails)',
    'YouTube-to-email funnel build',
    'Segmentation & tagging setup',
    'Analytics dashboard configuration',
    '3 months of priority support',
    'Monthly performance reviews',
    'Revenue optimization playbook',
  ];

  const guaranteeFeatures = [
    { icon: Shield, text: 'ROI in 90 days or we work free' },
    { icon: Clock, text: 'Setup completed in 14 days' },
    { icon: Zap, text: 'First 100 subscribers guaranteed' },
  ];

  return (
    <section id="pricing" className="section py-24 lg:py-32">
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
            Simple, Transparent{' '}
            <span className="text-gradient">Pricing</span>
          </h2>
          <p className="section-subtitle">
            One investment. Lifetime ownership of your audience. No monthly fees,
            no hidden costs, no surprises.
          </p>
        </motion.div>

        {/* Pricing Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#222] rounded-3xl border border-[#00ff88]/30 p-8 md:p-12 overflow-hidden">
            {/* Glow Effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#00ff88]/10 rounded-full blur-[100px]" />
            
            <div className="relative z-10">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00ff88]/10 border border-[#00ff88]/20 mb-8">
                <Zap className="w-4 h-4 text-[#00ff88]" />
                <span className="text-sm font-medium text-[#00ff88]">Complete Done-For-You Setup</span>
              </div>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl md:text-6xl font-bold text-gradient">$5,000</span>
                  <span className="text-xl text-[#a0a0a0]">one-time</span>
                </div>
                <p className="text-[#666]">No monthly fees. No hidden costs.</p>
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

              {/* Features List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-5 h-5 rounded-full bg-[#00ff88]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-[#00ff88]" />
                    </div>
                    <span className="text-[#a0a0a0] text-sm">{feature}</span>
                  </motion.div>
                ))}
              </div>

              {/* CTA Button */}
              <Button 
                size="xl" 
                className="w-full mb-8 animate-pulse-glow"
                onClick={() => window.location.href = '/book'}
              >
                Book Discovery Call
              </Button>

              {/* Guarantee */}
              <div className="bg-[#0a0a0a]/50 rounded-xl p-6 border border-white/5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[#00ff88]/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-[#00ff88]" />
                  </div>
                  <h4 className="font-bold">The EEC Guarantee</h4>
                </div>
                <div className="space-y-3">
                  {guaranteeFeatures.map((item) => (
                    <div key={item.text} className="flex items-center gap-3">
                      <item.icon className="w-4 h-4 text-[#00ff88]" />
                      <span className="text-sm text-[#a0a0a0]">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Comparison Note */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-[#666] text-sm">
            Compare to hiring an agency: $3,000+/month with 6-month contracts.
            <br />
            EEC pays for itself with your first product launch.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;

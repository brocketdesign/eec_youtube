import { motion } from 'framer-motion';
import { Youtube, Gift, Mail, TrendingUp, DollarSign } from 'lucide-react';
import AnimatedCounter from '../ui/AnimatedCounter';

const Solution = () => {
  const steps = [
    {
      icon: Youtube,
      title: 'YouTube Video',
      description: 'Create content as usual',
      color: '#ff0000',
    },
    {
      icon: Gift,
      title: 'Lead Magnet',
      description: 'Offer exclusive content',
      color: '#00ff88',
    },
    {
      icon: Mail,
      title: 'Email List',
      description: 'Own your audience',
      color: '#00d4aa',
    },
  ];

  const stats = [
    { value: 48, suffix: '%', label: 'of marketers use email', icon: TrendingUp },
    { value: 42, prefix: '$', suffix: '', label: 'ROI per $1 spent', icon: DollarSign },
  ];

  return (
    <section id="solution" className="section py-24 lg:py-32 bg-[#111]">
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
            The <span className="text-gradient">EEC Solution</span>
          </h2>
          <p className="section-subtitle">
            A simple 3-step system to transform your YouTube audience into
            an engaged email community you control.
          </p>
        </motion.div>

        {/* Funnel Visualization */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="flex items-center gap-4 md:gap-8"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative bg-[#1a1a1a] rounded-2xl border border-white/10 p-6 w-64 text-center group hover:border-[#00ff88]/30 transition-all duration-300"
                >
                  {/* Glow Effect */}
                  <div 
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
                    style={{ backgroundColor: `${step.color}20` }}
                  />
                  
                  <div className="relative z-10">
                    <div 
                      className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4"
                      style={{ backgroundColor: `${step.color}15` }}
                    >
                      <step.icon 
                        className="w-7 h-7" 
                        style={{ color: step.color }}
                      />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                    <p className="text-[#a0a0a0] text-sm">{step.description}</p>
                  </div>

                  {/* Step Number */}
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gradient-to-br from-[#00ff88] to-[#00d4aa] flex items-center justify-center text-[#0a0a0a] font-bold text-sm">
                    {index + 1}
                  </div>
                </motion.div>

                {/* Arrow */}
                {index < steps.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                    className="hidden md:flex items-center"
                  >
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <svg width="40" height="24" viewBox="0 0 40 24" fill="none">
                        <path
                          d="M0 12H36M36 12L26 2M36 12L26 22"
                          stroke="#00ff88"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          opacity="0.5"
                        />
                      </svg>
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-[#1a1a1a] rounded-2xl border border-white/10 p-8 flex items-center gap-6 hover:border-[#00ff88]/20 transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#00ff88]/10 flex items-center justify-center flex-shrink-0">
                <stat.icon className="w-8 h-8 text-[#00ff88]" />
              </div>
              <div>
                <div className="text-4xl font-bold text-gradient mb-1">
                  <AnimatedCounter 
                    value={stat.value} 
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                  />
                </div>
                <p className="text-[#a0a0a0]">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-lg text-[#a0a0a0] max-w-2xl mx-auto">
            Email marketing isn&apos;t dead. It&apos;s the{' '}
            <span className="text-white font-semibold">most profitable channel</span>{' '}
            for content creators who know how to use it.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Solution;

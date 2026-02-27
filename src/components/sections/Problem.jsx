import { motion } from 'framer-motion';
import { Shuffle, DollarSign, Briefcase } from 'lucide-react';
import { FlipCard } from '../ui/Card';

const Problem = () => {
  const fears = [
    {
      icon: Shuffle,
      title: 'Algorithm Change',
      description: 'YouTube tweaks the algorithm',
      consequence: 'Your views drop 70% overnight. Years of work... gone.',
      color: '#00ff88',
    },
    {
      icon: DollarSign,
      title: 'Demonetization',
      description: 'Content flagged or age-restricted',
      consequence: 'Ad revenue cut to $0. No warning, no appeal that works.',
      color: '#ff6b35',
    },
    {
      icon: Briefcase,
      title: 'Sponsor Drop',
      description: 'Brand pulls out mid-campaign',
      consequence: '50% of your income vanishes. Bills don\'t care.',
      color: '#00d4aa',
    },
  ];

  return (
    <section id="problem" className="section py-24 lg:py-32">
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
            What If <span className="text-gradient-orange">Tomorrow...</span>
          </h2>
          <p className="section-subtitle">
            Every gaming creator&apos;s nightmare. The platform you built your empire on
            can take it all away in an instant.
          </p>
        </motion.div>

        {/* Fear Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {fears.map((fear, index) => (
            <motion.div
              key={fear.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <FlipCard
                className="h-80"
                frontClassName=""
                backClassName=""
                front={
                  <>
                    <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                      style={{ backgroundColor: `${fear.color}15` }}
                    >
                      <fear.icon 
                        className="w-8 h-8" 
                        style={{ color: fear.color }}
                      />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{fear.title}</h3>
                    <p className="text-[#a0a0a0]">{fear.description}</p>
                    <div className="mt-6 text-sm text-[#666]">
                      Hover to see the consequence →
                    </div>
                  </>
                }
                back={
                  <>
                    <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                      style={{ backgroundColor: `${fear.color}25` }}
                    >
                      <fear.icon 
                        className="w-8 h-8" 
                        style={{ color: fear.color }}
                      />
                    </div>
                    <h3 className="text-xl font-bold mb-3" style={{ color: fear.color }}>
                      The Reality
                    </h3>
                    <p className="text-white/90 leading-relaxed">
                      {fear.consequence}
                    </p>
                  </>
                }
              />
            </motion.div>
          ))}
        </div>

        {/* Bottom Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-xl text-[#a0a0a0] max-w-2xl mx-auto">
            Sound familiar? You&apos;re not alone.{' '}
            <span className="text-white font-semibold">
              73% of gaming creators
            </span>{' '}
            worry about platform dependency every single day.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Problem;

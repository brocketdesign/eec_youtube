import { motion } from 'framer-motion';
import { 
  Magnet, 
  Droplets, 
  Users, 
  BarChart3, 
  Shield, 
  MessageCircle 
} from 'lucide-react';
import Card from '../ui/Card';

const Features = () => {
  const features = [
    {
      icon: Magnet,
      title: 'Automated Lead Magnets',
      description: 'Set up once, collect emails forever. Exclusive guides, cheat sheets, and bonus content that viewers actually want.',
      color: '#00ff88',
    },
    {
      icon: Droplets,
      title: 'Drip Campaigns',
      description: 'Welcome sequences that turn new subscribers into raving fans. Automated nurture emails that feel personal.',
      color: '#00d4aa',
    },
    {
      icon: Users,
      title: 'Smart Segmentation',
      description: 'Tag subscribers by game preference, engagement level, and purchase history. Send the right message to the right people.',
      color: '#ff6b35',
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: "Track open rates, click-throughs, and revenue attribution. Know exactly what's working and what's not.",
      color: '#00ff88',
    },
    {
      icon: Shield,
      title: 'Sponsor-Proof Revenue',
      description: 'Diversify your income with digital products, memberships, and affiliate offers. Never depend on one stream again.',
      color: '#00d4aa',
    },
    {
      icon: MessageCircle,
      title: 'Direct Fan Connection',
      description: "Bypass the algorithm and land directly in your fans' inboxes. Build real relationships that last.",
      color: '#ff6b35',
    },
  ];

  return (
    <section id="features" className="section py-24 lg:py-32 bg-[#111]">
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
            Everything You Need to{' '}
            <span className="text-gradient">Own Your Audience</span>
          </h2>
          <p className="section-subtitle">
            A complete email marketing system built specifically for gaming creators.
            No fluff. Just results.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card 
                className="h-full group"
                glow
              >
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${feature.color}15` }}
                >
                  <feature.icon 
                    className="w-7 h-7 transition-colors duration-300"
                    style={{ color: feature.color }}
                  />
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-[#00ff88] transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-[#a0a0a0] leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-8 md:gap-16"
        >
          {[
            { value: '10+', label: 'Integrations' },
            { value: '99.9%', label: 'Deliverability' },
            { value: '24/7', label: 'Support' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-gradient">{stat.value}</p>
              <p className="text-sm text-[#a0a0a0]">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;

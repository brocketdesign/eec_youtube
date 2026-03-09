import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Shield, Clock, Zap, Loader2 } from 'lucide-react';
import Button from '../ui/Button';
import { useSmoothScroll } from '../../hooks/useSmoothScroll';
import { api } from '../../lib/api';

const formatPrice = (cents) => {
  const dollars = cents / 100;
  return dollars % 1 === 0 ? `$${dollars.toLocaleString()}` : `$${dollars.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
};

const Pricing = () => {
  const { scrollToSection } = useSmoothScroll();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProducts()
      .then(setProducts)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Fallback features shown when a product has no features defined
  const defaultFeatures = [
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

  // Fallback when no products exist in DB yet
  const fallbackProduct = {
    id: null,
    name: 'Complete Done-For-You Setup',
    price: 500000,
    currency: 'usd',
    features: defaultFeatures,
    popular: true,
  };

  const displayProducts = products.length > 0 ? products : [fallbackProduct];

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

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-[#00ff88]" />
          </div>
        ) : (
          <div className={`mx-auto ${displayProducts.length === 1 ? 'max-w-2xl' : 'max-w-5xl grid gap-8 ' + (displayProducts.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3')}`}>
            {displayProducts.map((product, idx) => {
              const features = product.features?.length > 0 ? product.features : defaultFeatures;
              return (
                <motion.div
                  key={product.id || idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 * idx }}
                >
                  <div className={`relative bg-gradient-to-br from-[#1a1a1a] to-[#222] rounded-3xl border ${product.popular ? 'border-[#00ff88]/30' : 'border-white/10'} p-8 md:p-12 overflow-hidden h-full flex flex-col`}>
                    {/* Glow Effect */}
                    {product.popular && (
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#00ff88]/10 rounded-full blur-[100px]" />
                    )}

                    <div className="relative z-10 flex flex-col flex-1">
                      {/* Badge */}
                      {product.popular && (
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00ff88]/10 border border-[#00ff88]/20 mb-8 self-start">
                          <Zap className="w-4 h-4 text-[#00ff88]" />
                          <span className="text-sm font-medium text-[#00ff88]">Most Popular</span>
                        </div>
                      )}

                      {/* Product Name */}
                      <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                      {product.description && (
                        <p className="text-sm text-[#a0a0a0] mb-4">{product.description}</p>
                      )}

                      {/* Price */}
                      <div className="mb-8">
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="text-5xl md:text-6xl font-bold text-gradient">{formatPrice(product.price)}</span>
                          <span className="text-xl text-[#a0a0a0]">one-time</span>
                        </div>
                        <p className="text-[#666]">No monthly fees. No hidden costs.</p>
                      </div>

                      {/* Divider */}
                      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

                      {/* Features List */}
                      <div className="grid grid-cols-1 gap-4 mb-8 flex-1">
                        {features.map((feature, fIdx) => (
                          <motion.div
                            key={feature}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: fIdx * 0.05 }}
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
                        className={`w-full mb-8 ${product.popular ? 'animate-pulse-glow' : ''}`}
                        onClick={() => {
                          const url = product.id ? `/onboarding?product=${product.id}` : '/onboarding';
                          window.location.href = url;
                        }}
                      >
                        Get Started
                      </Button>

                      {/* Guarantee — only on popular or single product */}
                      {(product.popular || displayProducts.length === 1) && (
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
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

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

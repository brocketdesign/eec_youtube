import { motion } from 'framer-motion';
import Accordion from '../ui/Accordion';

const FAQ = () => {
  const faqs = [
    {
      question: 'Will this hurt my YouTube channel?',
      answer: "Absolutely not. In fact, it often helps. YouTube's algorithm rewards engagement, and email subscribers are your most engaged fans. They watch longer, comment more, and share your videos. Plus, you're not asking viewers to leave YouTube—you're offering them bonus content via email.",
    },
    {
      question: 'How long until I see results?',
      answer: 'Most creators see their first email subscribers within the first week of implementing the lead magnet. Revenue from email marketing typically starts within 30-60 days as your list grows. By the 90-day mark, you should have a sustainable email revenue stream running alongside your YouTube income.',
    },
    {
      question: 'Do I need to learn email marketing?',
      answer: "Nope. That's the beauty of EEC. We build everything for you and hand you a fully operational system. You'll get simple playbooks for ongoing content, but the heavy lifting—strategy, setup, automation—is all done for you.",
    },
    {
      question: 'What if I already have a small list?',
      answer: "Even better! We'll audit your existing setup, optimize what's working, and fix what's not. Many creators come to us with a few hundred subscribers and leave with a growth engine that turns their list into a real asset.",
    },
    {
      question: 'Is this only for big YouTubers?',
      answer: "EEC is designed for creators with 100K+ subscribers who are serious about building a sustainable business. If you're smaller but growing fast and want to get ahead of the curve, book a call and we'll see if it's the right fit."
    },
  ];

  return (
    <section id="faq" className="section py-24 lg:py-32 bg-[#111]">
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
            Questions? <span className="text-gradient">We Got Answers</span>
          </h2>
          <p className="section-subtitle">
            Everything you need to know about EEC and how it works for gaming creators.
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion items={faqs} />
        </motion.div>

        {/* Still Have Questions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-[#a0a0a0] mb-4">Still have questions?</p>
          <a 
            href="#cta"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-[#00ff88] hover:underline font-medium"
          >
            Book a free 15-minute call →
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;

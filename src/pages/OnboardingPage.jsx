import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Youtube, Palette, Users, Target, Mail, CreditCard, CheckCircle, Loader2 } from 'lucide-react';
import { api } from '../lib/api';

const TOTAL_STEPS = 6;

const nicheOptions = [
  'Gaming', 'Tech', 'Education', 'Entertainment', 'Music', 'Fitness & Health',
  'Cooking & Food', 'Finance', 'Travel', 'Beauty & Fashion', 'Lifestyle', 'Science',
  'Comedy', 'News & Politics', 'Sports', 'DIY & Crafts', 'Automotive', 'Other',
];

const goalOptions = [
  { id: 'grow-list', label: 'Grow my email list', desc: 'Convert viewers into subscribers' },
  { id: 'monetize', label: 'Monetize my audience', desc: 'Sell products, courses, or services' },
  { id: 'community', label: 'Build community', desc: 'Create deeper connections with fans' },
  { id: 'product-launch', label: 'Launch products', desc: 'Email sequences for product launches' },
  { id: 'sponsors', label: 'Attract sponsors', desc: 'Show email list size to potential sponsors' },
  { id: 'backup', label: 'Algorithm insurance', desc: 'Own your audience outside YouTube' },
];

const toneOptions = [
  { id: 'professional', label: 'Professional', emoji: '💼' },
  { id: 'casual', label: 'Casual & Fun', emoji: '😎' },
  { id: 'energetic', label: 'High Energy', emoji: '⚡' },
  { id: 'educational', label: 'Educational', emoji: '📚' },
  { id: 'inspirational', label: 'Inspirational', emoji: '🌟' },
  { id: 'witty', label: 'Witty & Clever', emoji: '🧠' },
];

const frequencyOptions = [
  { id: 'daily', label: 'Daily', desc: 'For hardcore engagement' },
  { id: '3x-week', label: '3x per week', desc: 'High-frequency growth' },
  { id: 'weekly', label: 'Weekly', desc: 'Most popular choice', recommended: true },
  { id: 'biweekly', label: 'Every 2 weeks', desc: 'Low maintenance' },
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialStep = parseInt(searchParams.get('step')) || 1;
  const [step, setStep] = useState(initialStep);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [form, setForm] = useState({
    channelUrl: '',
    channelName: '',
    subscriberCount: '',
    niche: '',
    customNiche: '',
    brandName: '',
    primaryColor: '#00ff88',
    secondaryColor: '#0a0a0a',
    toneOfVoice: '',
    targetAudience: '',
    audienceInterests: '',
    goals: [],
    emailFrequency: 'weekly',
    contentTopics: '',
    leadMagnetIdea: '',
    name: '',
    email: '',
  });

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));
  const toggleGoal = (id) => setForm(prev => ({
    ...prev,
    goals: prev.goals.includes(id) ? prev.goals.filter(g => g !== id) : [...prev.goals, id],
  }));

  const canProceed = () => {
    switch (step) {
      case 1: return form.channelUrl && form.channelName && form.niche;
      case 2: return form.brandName && form.toneOfVoice;
      case 3: return form.targetAudience;
      case 4: return form.goals.length > 0;
      case 5: return form.emailFrequency;
      case 6: return form.name && form.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
      default: return false;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const onboarding = {
        channelUrl: form.channelUrl,
        channelName: form.channelName,
        subscriberCount: form.subscriberCount,
        niche: form.niche === 'Other' ? form.customNiche : form.niche,
        brandName: form.brandName,
        brandColors: { primary: form.primaryColor, secondary: form.secondaryColor },
        toneOfVoice: form.toneOfVoice,
        targetAudience: form.targetAudience,
        audienceInterests: form.audienceInterests.split(',').map(s => s.trim()).filter(Boolean),
        goals: form.goals,
        emailFrequency: form.emailFrequency,
        contentTopics: form.contentTopics.split(',').map(s => s.trim()).filter(Boolean),
        leadMagnetIdea: form.leadMagnetIdea,
      };

      // Save onboarding data
      const { userId } = await api.submitOnboarding({
        email: form.email,
        name: form.name,
        onboarding,
      });

      // Create Stripe checkout session with optional product selection
      const productId = searchParams.get('product') || undefined;
      const { sessionUrl } = await api.createCheckout(userId, productId);

      // Redirect to Stripe
      window.location.href = sessionUrl;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const nextStep = () => { if (canProceed() && step < TOTAL_STEPS) setStep(step + 1); };
  const prevStep = () => { if (step > 1) setStep(step - 1); };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Step {step} of {TOTAL_STEPS}</span>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-0.5 bg-white/5">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500"
            animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="pt-28 pb-32 px-6">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Step 1: Channel Info */}
              {step === 1 && (
                <StepWrapper icon={Youtube} title="Tell us about your channel" subtitle="We'll use this to understand your brand and create the perfect email system.">
                  <Field label="YouTube Channel URL" required>
                    <input type="url" placeholder="https://youtube.com/@yourchannel" value={form.channelUrl}
                      onChange={(e) => update('channelUrl', e.target.value)} className="input-field" />
                  </Field>
                  <Field label="Channel Name" required>
                    <input type="text" placeholder="Your channel name" value={form.channelName}
                      onChange={(e) => update('channelName', e.target.value)} className="input-field" />
                  </Field>
                  <Field label="Approximate Subscribers">
                    <select value={form.subscriberCount} onChange={(e) => update('subscriberCount', e.target.value)} className="input-field">
                      <option value="">Select range</option>
                      <option value="0-1k">0 - 1K</option>
                      <option value="1k-10k">1K - 10K</option>
                      <option value="10k-100k">10K - 100K</option>
                      <option value="100k-500k">100K - 500K</option>
                      <option value="500k-1m">500K - 1M</option>
                      <option value="1m+">1M+</option>
                    </select>
                  </Field>
                  <Field label="Your Niche" required>
                    <div className="grid grid-cols-3 gap-2">
                      {nicheOptions.map((n) => (
                        <button key={n} onClick={() => update('niche', n)}
                          className={`px-3 py-2 rounded-lg text-sm border transition-all ${form.niche === n ? 'border-emerald-400 bg-emerald-500/10 text-emerald-400' : 'border-white/10 text-gray-400 hover:border-white/20'}`}>
                          {n}
                        </button>
                      ))}
                    </div>
                    {form.niche === 'Other' && (
                      <input type="text" placeholder="Describe your niche" value={form.customNiche}
                        onChange={(e) => update('customNiche', e.target.value)} className="input-field mt-3" />
                    )}
                  </Field>
                </StepWrapper>
              )}

              {/* Step 2: Brand Identity */}
              {step === 2 && (
                <StepWrapper icon={Palette} title="Your Brand Identity" subtitle="We'll match your email templates to your brand look and feel.">
                  <Field label="Brand / Email Newsletter Name" required>
                    <input type="text" placeholder="E.g., The Gaming Insider, Tech Weekly" value={form.brandName}
                      onChange={(e) => update('brandName', e.target.value)} className="input-field" />
                  </Field>
                  <Field label="Brand Colors">
                    <div className="flex gap-4">
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Primary</label>
                        <div className="flex items-center gap-2">
                          <input type="color" value={form.primaryColor} onChange={(e) => update('primaryColor', e.target.value)}
                            className="w-10 h-10 rounded-lg border border-white/10 bg-transparent cursor-pointer" />
                          <input type="text" value={form.primaryColor} onChange={(e) => update('primaryColor', e.target.value)}
                            className="input-field w-28 text-sm" />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Secondary</label>
                        <div className="flex items-center gap-2">
                          <input type="color" value={form.secondaryColor} onChange={(e) => update('secondaryColor', e.target.value)}
                            className="w-10 h-10 rounded-lg border border-white/10 bg-transparent cursor-pointer" />
                          <input type="text" value={form.secondaryColor} onChange={(e) => update('secondaryColor', e.target.value)}
                            className="input-field w-28 text-sm" />
                        </div>
                      </div>
                    </div>
                  </Field>
                  <Field label="Tone of Voice" required>
                    <div className="grid grid-cols-2 gap-3">
                      {toneOptions.map((t) => (
                        <button key={t.id} onClick={() => update('toneOfVoice', t.id)}
                          className={`flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${form.toneOfVoice === t.id ? 'border-emerald-400 bg-emerald-500/10' : 'border-white/10 hover:border-white/20'}`}>
                          <span className="text-2xl">{t.emoji}</span>
                          <span className={form.toneOfVoice === t.id ? 'text-emerald-400 font-medium' : 'text-gray-300'}>{t.label}</span>
                        </button>
                      ))}
                    </div>
                  </Field>
                </StepWrapper>
              )}

              {/* Step 3: Audience */}
              {step === 3 && (
                <StepWrapper icon={Users} title="Who's Your Audience?" subtitle="The better we understand your viewers, the more effective your emails will be.">
                  <Field label="Describe your target audience" required>
                    <textarea placeholder="E.g., Male 18-34, interested in competitive FPS games, tech enthusiasts who love in-depth reviews..."
                      value={form.targetAudience} onChange={(e) => update('targetAudience', e.target.value)}
                      className="input-field min-h-[100px] resize-none" />
                  </Field>
                  <Field label="Audience interests (comma separated)">
                    <input type="text" placeholder="E.g., gaming tips, hardware reviews, esports"
                      value={form.audienceInterests} onChange={(e) => update('audienceInterests', e.target.value)}
                      className="input-field" />
                  </Field>
                  <Field label="Lead magnet idea (what would you offer for free?)">
                    <input type="text" placeholder="E.g., Free settings guide, exclusive tier list, cheat sheet"
                      value={form.leadMagnetIdea} onChange={(e) => update('leadMagnetIdea', e.target.value)}
                      className="input-field" />
                  </Field>
                </StepWrapper>
              )}

              {/* Step 4: Goals */}
              {step === 4 && (
                <StepWrapper icon={Target} title="What Are Your Goals?" subtitle="Select all that apply. This helps us tailor your email content.">
                  <div className="space-y-3">
                    {goalOptions.map((g) => (
                      <button key={g.id} onClick={() => toggleGoal(g.id)}
                        className={`w-full flex items-start gap-4 p-5 rounded-xl border transition-all text-left ${form.goals.includes(g.id)
                          ? 'border-emerald-400 bg-emerald-500/10' : 'border-white/10 hover:border-white/20'}`}>
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${form.goals.includes(g.id)
                          ? 'border-emerald-400 bg-emerald-400' : 'border-white/30'}`}>
                          {form.goals.includes(g.id) && <CheckCircle className="w-3 h-3 text-[#0a0a0a]" />}
                        </div>
                        <div>
                          <p className={`font-medium ${form.goals.includes(g.id) ? 'text-emerald-400' : 'text-white'}`}>{g.label}</p>
                          <p className="text-sm text-gray-500">{g.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </StepWrapper>
              )}

              {/* Step 5: Email Preferences */}
              {step === 5 && (
                <StepWrapper icon={Mail} title="Email Preferences" subtitle="How often do you want to email your subscribers?">
                  <Field label="Email Frequency" required>
                    <div className="space-y-3">
                      {frequencyOptions.map((f) => (
                        <button key={f.id} onClick={() => update('emailFrequency', f.id)}
                          className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${form.emailFrequency === f.id
                            ? 'border-emerald-400 bg-emerald-500/10' : 'border-white/10 hover:border-white/20'}`}>
                          <div className="text-left">
                            <p className={`font-medium ${form.emailFrequency === f.id ? 'text-emerald-400' : 'text-white'}`}>{f.label}</p>
                            <p className="text-sm text-gray-500">{f.desc}</p>
                          </div>
                          {f.recommended && <span className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full">Recommended</span>}
                        </button>
                      ))}
                    </div>
                  </Field>
                  <Field label="Content topics you want to cover (comma separated)">
                    <input type="text" placeholder="E.g., tips & tricks, behind the scenes, news, product reviews"
                      value={form.contentTopics} onChange={(e) => update('contentTopics', e.target.value)}
                      className="input-field" />
                  </Field>
                </StepWrapper>
              )}

              {/* Step 6: Account & Payment */}
              {step === 6 && (
                <StepWrapper icon={CreditCard} title="Almost Done!" subtitle="Enter your details and proceed to secure payment.">
                  <Field label="Your Full Name" required>
                    <input type="text" placeholder="John Doe" value={form.name}
                      onChange={(e) => update('name', e.target.value)} className="input-field" />
                  </Field>
                  <Field label="Email Address" required>
                    <input type="email" placeholder="you@example.com" value={form.email}
                      onChange={(e) => update('email', e.target.value)} className="input-field" />
                    <p className="text-xs text-gray-500 mt-1">We'll send your dashboard credentials to this email.</p>
                  </Field>

                  <div className="mt-8 p-6 rounded-xl bg-[#111] border border-white/10">
                    <h3 className="font-bold text-lg mb-4">Order Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-gray-400">
                        <span>AI Email System Setup</span>
                        <span className="text-white">$500.00</span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>Welcome Sequence (5 emails)</span>
                        <span className="text-emerald-400">Included</span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>Newsletter Templates (4)</span>
                        <span className="text-emerald-400">Included</span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>Re-engagement Campaign (3 emails)</span>
                        <span className="text-emerald-400">Included</span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>Full CRM Setup (Brevo)</span>
                        <span className="text-emerald-400">Included</span>
                      </div>
                      <div className="border-t border-white/10 pt-3 mt-3 flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span className="text-emerald-400">$500.00</span>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>
                  )}
                </StepWrapper>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0a0a0a]/90 backdrop-blur-xl border-t border-white/5 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button onClick={prevStep} disabled={step === 1}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all ${step === 1 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}>
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          {step < TOTAL_STEPS ? (
            <button onClick={nextStep} disabled={!canProceed()}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all ${canProceed()
                ? 'bg-gradient-to-r from-emerald-400 to-emerald-500 text-[#0a0a0a] hover:shadow-lg hover:shadow-emerald-500/25'
                : 'bg-white/10 text-gray-500 cursor-not-allowed'}`}>
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={!canProceed() || loading}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all ${canProceed() && !loading
                ? 'bg-gradient-to-r from-emerald-400 to-emerald-500 text-[#0a0a0a] hover:shadow-lg hover:shadow-emerald-500/25'
                : 'bg-white/10 text-gray-500 cursor-not-allowed'}`}>
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</> : <>Pay $500 & Launch <ArrowRight className="w-4 h-4" /></>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Helper Components ---

function StepWrapper({ icon: Icon, title, subtitle, children }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
          <Icon className="w-5 h-5 text-emerald-400" />
        </div>
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      <p className="text-gray-400 mb-8 ml-[52px]">{subtitle}</p>
      <div className="space-y-6">{children}</div>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label} {required && <span className="text-emerald-400">*</span>}
      </label>
      {children}
    </div>
  );
}

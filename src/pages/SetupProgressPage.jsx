import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle, XCircle, Brain, Server, Mail } from 'lucide-react';
import { api } from '../lib/api';

const statusSteps = [
  { key: 'processing', icon: Brain, label: 'Processing your request...', desc: 'Getting everything ready' },
  { key: 'generating_content', icon: Brain, label: 'AI is generating your emails...', desc: 'Creating welcome sequence, newsletters, and re-engagement campaigns' },
  { key: 'setting_up_crm', icon: Server, label: 'Setting up your CRM...', desc: 'Configuring Brevo with your templates and automation' },
  { key: 'complete', icon: Mail, label: 'Your email system is ready!', desc: 'Everything is set up and ready to go' },
];

export default function SetupProgressPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sessionId) return;

    const poll = async () => {
      try {
        const data = await api.getSetupStatus(sessionId);
        setStatus(data);
        if (data.status === 'complete' || data.status === 'failed') return;
      } catch (err) {
        setError(err.message);
        return;
      }
      // Poll every 3 seconds while in progress
      setTimeout(poll, 3000);
    };

    poll();
  }, [sessionId]);

  if (!sessionId) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Session Found</h1>
          <p className="text-gray-400 mb-6">It looks like you arrived here without completing payment.</p>
          <Link to="/onboarding" className="px-6 py-3 bg-emerald-500 text-[#0a0a0a] font-semibold rounded-xl">Start Onboarding</Link>
        </div>
      </div>
    );
  }

  const currentStepIndex = statusSteps.findIndex(s => s.key === status?.status);
  const isComplete = status?.status === 'complete';
  const isFailed = status?.status === 'failed';

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-6">
      <div className="max-w-lg w-full">
        <div className="text-center mb-12">
          <Link to="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center font-bold text-sm text-[#0a0a0a]">E</div>
            <span className="font-bold text-lg">EEC</span>
          </Link>

          {isFailed ? (
            <>
              <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-2">Setup Failed</h1>
              <p className="text-gray-400 mb-2">Something went wrong during setup.</p>
              <p className="text-red-400 text-sm mb-6">{status?.error}</p>
              <Link to="/onboarding" className="px-6 py-3 bg-emerald-500 text-[#0a0a0a] font-semibold rounded-xl">Try Again</Link>
            </>
          ) : isComplete ? (
            <>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
                <CheckCircle className="w-20 h-20 text-emerald-400 mx-auto mb-4" />
              </motion.div>
              <h1 className="text-3xl font-bold mb-2">You're All Set! 🎉</h1>
              <p className="text-gray-400 mb-8">Your email system for <strong className="text-white">{status?.brandName}</strong> is ready.</p>
              <p className="text-sm text-gray-500 mb-6">We've sent your dashboard access details to <strong className="text-emerald-400">{status?.email}</strong></p>
              <Link to="/dashboard" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-400 to-emerald-500 text-[#0a0a0a] font-bold rounded-xl text-lg hover:shadow-xl hover:shadow-emerald-500/25 transition-all">
                Go to Dashboard
              </Link>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold mb-2">Setting Up Your System</h1>
              <p className="text-gray-400 mb-12">This usually takes 2-5 minutes. Don't close this page.</p>
            </>
          )}
        </div>

        {!isComplete && !isFailed && (
          <div className="space-y-4">
            {statusSteps.map((s, i) => {
              const isActive = i === currentStepIndex;
              const isDone = i < currentStepIndex;
              const isPending = i > currentStepIndex;

              return (
                <motion.div
                  key={s.key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex items-center gap-4 p-5 rounded-xl border transition-all ${
                    isActive ? 'border-emerald-500/50 bg-emerald-500/5' :
                    isDone ? 'border-emerald-500/20 bg-emerald-500/5' :
                    'border-white/5 bg-[#111]'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isDone ? 'bg-emerald-500/20' : isActive ? 'bg-emerald-500/10' : 'bg-white/5'
                  }`}>
                    {isDone ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    ) : isActive ? (
                      <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />
                    ) : (
                      <s.icon className="w-5 h-5 text-gray-600" />
                    )}
                  </div>
                  <div>
                    <p className={`font-medium ${isDone ? 'text-emerald-400' : isActive ? 'text-white' : 'text-gray-600'}`}>
                      {s.label}
                    </p>
                    <p className={`text-sm ${isPending ? 'text-gray-700' : 'text-gray-500'}`}>{s.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">{error}</div>
        )}
      </div>
    </div>
  );
}

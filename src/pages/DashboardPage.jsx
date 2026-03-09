import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Mail, FileText, Globe, Settings, LogOut, Users,
  Send, Eye, MousePointerClick, ChevronRight, ExternalLink, Copy,
  Check, Edit3, Save, X, RefreshCw, Loader2
} from 'lucide-react';
import { api } from '../lib/api';

const tabs = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'welcome', label: 'Welcome Sequence', icon: Mail },
  { id: 'newsletter', label: 'Newsletters', icon: FileText },
  { id: 'reengagement', label: 'Re-engagement', icon: RefreshCw },
  { id: 'domain', label: 'Domain', icon: Globe },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const stored = localStorage.getItem('eec_user');
  const user = stored ? JSON.parse(stored) : null;

  useEffect(() => {
    if (!user?._id) {
      navigate('/login');
      return;
    }
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const result = await api.getDashboard(user._id);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('eec_user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Dashboard</h1>
          <p className="text-red-400 mb-6">{error}</p>
          <button onClick={loadDashboard} className="px-6 py-3 bg-emerald-500 text-[#0a0a0a] font-semibold rounded-xl">Retry</button>
        </div>
      </div>
    );
  }

  const brandName = data?.user?.onboarding?.brandName || data?.user?.onboarding?.channelName || data?.user?.name || 'Your Brand';

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#080808] border-r border-white/5 flex flex-col fixed inset-y-0 left-0 z-40">
        <div className="p-6 border-b border-white/5">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center font-bold text-sm text-[#0a0a0a]">E</div>
            <span className="font-bold">EEC</span>
          </Link>
          <p className="text-xs text-gray-500 mt-2 truncate">{brandName}</p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all ${
                activeTab === tab.id
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}>
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-white/5">
          <a href="https://app.brevo.com" target="_blank" rel="noopener noreferrer"
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all">
            <ExternalLink className="w-4 h-4" />
            Open Brevo CRM
          </a>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-all">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            {activeTab === 'overview' && <OverviewTab data={data} />}
            {activeTab === 'welcome' && <EmailListTab title="Welcome Sequence" description="Sent automatically to new subscribers" emails={data?.templates?.welcome || []} type="welcome" userId={user._id} onUpdate={loadDashboard} />}
            {activeTab === 'newsletter' && <EmailListTab title="Newsletter Templates" description="Reusable templates for your regular sends" emails={data?.templates?.newsletter || []} type="newsletter" userId={user._id} onUpdate={loadDashboard} />}
            {activeTab === 'reengagement' && <EmailListTab title="Re-engagement Campaign" description="Win back inactive subscribers" emails={data?.templates?.reEngagement || []} type="reEngagement" userId={user._id} onUpdate={loadDashboard} />}
            {activeTab === 'domain' && <DomainTab data={data} userId={user._id} onUpdate={loadDashboard} />}
            {activeTab === 'settings' && <SettingsTab data={data} />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Overview Tab
// ---------------------------------------------------------------------------

function OverviewTab({ data }) {
  const stats = data?.stats || {};
  const cards = [
    { label: 'Total Contacts', value: stats.totalContacts || 0, icon: Users, color: 'emerald' },
    { label: 'Emails Sent', value: stats.emailsSent || 0, icon: Send, color: 'blue' },
    { label: 'Open Rate', value: `${(stats.openRate || 0).toFixed(1)}%`, icon: Eye, color: 'purple' },
    { label: 'Click Rate', value: `${(stats.clickRate || 0).toFixed(1)}%`, icon: MousePointerClick, color: 'amber' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
      <p className="text-gray-500 mb-8">Overview of your email marketing system</p>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="p-5 rounded-2xl bg-[#111] border border-white/5">
            <div className="flex items-center justify-between mb-3">
              <c.icon className="w-5 h-5 text-gray-500" />
            </div>
            <p className="text-2xl font-bold">{c.value}</p>
            <p className="text-sm text-gray-500">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Open Brevo CRM', desc: 'Manage contacts & send campaigns', href: 'https://app.brevo.com', external: true },
          { label: 'View Templates', desc: 'Edit your email templates', action: 'welcome' },
          { label: 'Setup Domain', desc: 'Configure your custom domain', action: 'domain' },
        ].map((a) => (
          <a key={a.label} href={a.href || '#'} target={a.external ? '_blank' : undefined} rel={a.external ? 'noopener noreferrer' : undefined}
            className="p-5 rounded-2xl bg-[#111] border border-white/5 hover:border-emerald-500/30 transition-all group cursor-pointer block">
            <p className="font-medium text-white mb-1 flex items-center gap-2">
              {a.label}
              <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-emerald-400 transition-colors" />
            </p>
            <p className="text-sm text-gray-500">{a.desc}</p>
          </a>
        ))}
      </div>

      {/* Content Summary */}
      <h2 className="text-lg font-bold mt-8 mb-4">Your Email Content</h2>
      <div className="grid grid-cols-3 gap-4">
        <ContentCountCard label="Welcome Emails" count={data?.templates?.welcome?.length || 0} />
        <ContentCountCard label="Newsletter Templates" count={data?.templates?.newsletter?.length || 0} />
        <ContentCountCard label="Re-engagement Emails" count={data?.templates?.reEngagement?.length || 0} />
      </div>
    </div>
  );
}

function ContentCountCard({ label, count }) {
  return (
    <div className="p-5 rounded-2xl bg-[#111] border border-white/5">
      <p className="text-3xl font-bold text-emerald-400">{count}</p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Email List Tab (shared for welcome, newsletter, re-engagement)
// ---------------------------------------------------------------------------

function EmailListTab({ title, description, emails, type, userId, onUpdate }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [editSubject, setEditSubject] = useState('');
  const [editContent, setEditContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(null);

  const startEdit = (i) => {
    setEditingIndex(i);
    setEditSubject(emails[i].subject || '');
    setEditContent(emails[i].htmlContent || '');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.updateTemplate(userId, {
        type,
        index: editingIndex,
        subject: editSubject,
        htmlContent: editContent,
      });
      setEditingIndex(null);
      onUpdate();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">{title}</h1>
      <p className="text-gray-500 mb-8">{description}</p>

      <div className="space-y-4">
        {emails.map((email, i) => (
          <div key={i} className="rounded-2xl bg-[#111] border border-white/5 overflow-hidden">
            <div className="flex items-center justify-between p-5">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {type !== 'newsletter' && (
                    <span className="text-xs px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full">
                      {email.order ? `Email ${email.order}` : `#${i + 1}`}
                    </span>
                  )}
                  {email.delayDays && (
                    <span className="text-xs px-2 py-0.5 bg-white/5 text-gray-400 rounded-full">
                      Day {email.delayDays}
                    </span>
                  )}
                </div>
                <p className="font-medium text-white truncate">{email.subject || email.name || `Template ${i + 1}`}</p>
                {email.preheader && <p className="text-sm text-gray-500 truncate">{email.preheader}</p>}
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button onClick={() => setPreviewIndex(previewIndex === i ? null : i)}
                  className="px-3 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                  <Eye className="w-4 h-4" />
                </button>
                <button onClick={() => startEdit(i)}
                  className="px-3 py-1.5 text-sm text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/5 rounded-lg transition-all">
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Preview */}
            {previewIndex === i && (
              <div className="border-t border-white/5 p-5">
                <div className="bg-white rounded-xl overflow-hidden max-h-96 overflow-y-auto">
                  <div dangerouslySetInnerHTML={{ __html: email.htmlContent || '<p style="padding:20px;color:#666;">No preview available</p>' }} />
                </div>
              </div>
            )}

            {/* Edit */}
            {editingIndex === i && (
              <div className="border-t border-white/5 p-5 space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Subject Line</label>
                  <input type="text" value={editSubject} onChange={(e) => setEditSubject(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#0a0a0a] border border-white/10 rounded-xl text-white focus:border-emerald-500/50 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">HTML Content</label>
                  <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#0a0a0a] border border-white/10 rounded-xl text-white font-mono text-xs min-h-[200px] focus:border-emerald-500/50 focus:outline-none resize-y" />
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={handleSave} disabled={saving}
                    className="flex items-center gap-2 px-5 py-2 bg-emerald-500 text-[#0a0a0a] font-semibold rounded-xl text-sm disabled:opacity-50">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
                  </button>
                  <button onClick={() => setEditingIndex(null)}
                    className="flex items-center gap-2 px-5 py-2 border border-white/10 rounded-xl text-sm text-gray-400 hover:text-white">
                    <X className="w-4 h-4" /> Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {emails.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Mail className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No emails generated yet. Your content will appear here once setup is complete.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Domain Tab
// ---------------------------------------------------------------------------

function DomainTab({ data, userId, onUpdate }) {
  const [domain, setDomain] = useState(data?.domain?.domain || '');
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState(null);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.updateDomain(userId, domain);
      setResult(res);
      onUpdate();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Custom Domain</h1>
      <p className="text-gray-500 mb-8">Send emails from your own domain for professional branding</p>

      <div className="max-w-2xl space-y-6">
        <div className="p-6 rounded-2xl bg-[#111] border border-white/5">
          <label className="block text-sm font-medium text-gray-300 mb-2">Your Domain</label>
          <div className="flex gap-3">
            <input type="text" value={domain} onChange={(e) => setDomain(e.target.value)}
              placeholder="mail.yourdomain.com"
              className="flex-1 px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-xl text-white focus:border-emerald-500/50 focus:outline-none" />
            <button onClick={handleSave} disabled={saving || !domain}
              className="px-6 py-3 bg-emerald-500 text-[#0a0a0a] font-semibold rounded-xl disabled:opacity-50 flex items-center gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
            </button>
          </div>
        </div>

        {(result?.dnsInstructions || data?.domain?.domain) && (
          <div className="p-6 rounded-2xl bg-[#111] border border-white/5">
            <h3 className="font-bold mb-4">DNS Records</h3>
            <p className="text-sm text-gray-400 mb-4">Add these records to your domain's DNS settings:</p>
            <div className="space-y-3">
              {(result?.dnsInstructions?.records || [
                { type: 'TXT', name: `eec._domainkey.${data.domain.domain}`, value: 'Contact support for DKIM key' },
                { type: 'TXT', name: data.domain.domain, value: 'v=spf1 include:sendinblue.com ~all' },
              ]).map((record, i) => (
                <DNSRecord key={i} record={record} />
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${data?.domain?.verified ? 'bg-emerald-400' : 'bg-yellow-400'}`} />
              <span className="text-sm text-gray-400">
                {data?.domain?.verified ? 'Domain verified' : 'Pending verification — DNS changes can take up to 48 hours'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DNSRecord({ record }) {
  const [copied, setCopied] = useState(false);
  const copyValue = () => {
    navigator.clipboard.writeText(record.value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="p-4 bg-[#0a0a0a] rounded-xl border border-white/5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs px-2 py-0.5 bg-white/5 text-gray-400 rounded">{record.type}</span>
        <button onClick={copyValue} className="text-xs text-gray-500 hover:text-emerald-400 flex items-center gap-1">
          {copied ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
        </button>
      </div>
      <p className="text-xs text-gray-500 mb-1">Name: <span className="text-gray-300 font-mono">{record.name}</span></p>
      <p className="text-xs text-gray-500">Value: <span className="text-gray-300 font-mono break-all">{record.value}</span></p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Settings Tab
// ---------------------------------------------------------------------------

function SettingsTab({ data }) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Settings</h1>
      <p className="text-gray-500 mb-8">Account information and configuration</p>

      <div className="max-w-2xl space-y-6">
        <div className="p-6 rounded-2xl bg-[#111] border border-white/5">
          <h3 className="font-bold mb-4">Account Details</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-gray-500">Name</span>
              <span className="text-white">{data?.user?.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-gray-500">Email</span>
              <span className="text-white">{data?.user?.email}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-gray-500">Brand</span>
              <span className="text-white">{data?.user?.onboarding?.brandName || 'Not set'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-gray-500">Channel</span>
              <span className="text-emerald-400">{data?.user?.onboarding?.channelUrl || 'Not set'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-gray-500">Setup Status</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                data?.user?.setupStatus === 'complete' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-yellow-500/10 text-yellow-400'
              }`}>
                {data?.user?.setupStatus}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-500">Member Since</span>
              <span className="text-white">{data?.user?.createdAt ? new Date(data.user.createdAt).toLocaleDateString() : '-'}</span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#111] border border-white/5">
          <h3 className="font-bold mb-4">CRM Access</h3>
          <p className="text-sm text-gray-400 mb-4">Your email marketing is powered by Brevo. Access the full CRM for advanced features.</p>
          <a href="https://app.brevo.com" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0a0a0a] border border-white/10 rounded-xl text-sm text-white hover:border-emerald-500/30 transition-all">
            <ExternalLink className="w-4 h-4" /> Open Brevo Dashboard
          </a>
        </div>

        {data?.brevo?.listId && (
          <div className="p-6 rounded-2xl bg-[#111] border border-white/5">
            <h3 className="font-bold mb-4">Integration Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-gray-500">Brevo List ID</span>
                <span className="text-white font-mono">{data.brevo.listId}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-gray-500">Welcome Templates</span>
                <span className="text-white">{data.brevo.templateIds?.welcome?.length || 0}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-gray-500">Newsletter Templates</span>
                <span className="text-white">{data.brevo.templateIds?.newsletter?.length || 0}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500">Re-engagement Templates</span>
                <span className="text-white">{data.brevo.templateIds?.reEngagement?.length || 0}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

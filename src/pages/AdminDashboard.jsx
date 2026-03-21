import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  Plus,
  Trash2,
  CheckCircle2,
  Mail,
  Shield,
  Lock,
  Loader2,
  RefreshCw,
  Phone,
  Eye,
  EyeOff,
  CalendarPlus,
  UserCheck,
  AlertCircle,
  X,
  Settings,
  BookOpen,
  Download,
  Save,
  Key,
  Copy,
  FileText,
  Clipboard,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { api } from '../lib/api';

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */
const formatTime12 = (t) => {
  const [h, m] = t.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${period}`;
};

const fmtDate = (d) =>
  new Date(d + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

const fmtDateTime = (iso) =>
  new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

const DEFAULT_TIMES = [
  '09:00','09:30','10:00','10:30','11:00','11:30',
  '12:00','12:30','13:00','13:30','14:00','14:30',
  '15:00','15:30','16:00','16:30','17:00',
];

/* ------------------------------------------------------------------ */
/*  Admin Login                                                        */
/* ------------------------------------------------------------------ */
function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.adminLogin(password);
      onLogin(password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto bg-[#1a1a1a] border border-[#333] rounded-2xl flex items-center justify-center mb-4">
            <Shield className="w-7 h-7 text-[#00ff88]" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-[#666] text-sm mt-1">Enter your password to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#111] border border-[#222] rounded-2xl p-6 space-y-4">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
            <input
              type={show ? 'text' : 'password'}
              value={password}
              autoFocus
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl pl-10 pr-12 py-3 text-white placeholder:text-[#444] focus:outline-none focus:border-[#00ff88] transition-colors"
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] hover:text-white"
            >
              {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {error && (
            <p className="text-red-400 text-sm flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </p>
          )}

          <button
            type="submit"
            disabled={!password || loading}
            className={`
              w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2
              ${!password || loading
                ? 'bg-[#1a1a1a] text-[#666] cursor-not-allowed'
                : 'bg-gradient-to-r from-[#00ff88] to-[#00d4aa] text-[#0a0a0a] hover:shadow-[0_0_30px_rgba(0,255,136,0.4)]'
              }
            `}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Log In'}
          </button>
        </form>

        <div className="text-center mt-4">
          <Link to="/" className="text-[#666] text-sm hover:text-white transition-colors inline-flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Admin Dashboard                                               */
/* ------------------------------------------------------------------ */
export default function AdminDashboard() {
  const [password, setPassword] = useState(null);
  const [tab, setTab] = useState('schedule'); // schedule | bookings | downloads | newsletter | settings
  const [schedule, setSchedule] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  // Notification email
  const [notifEmail, setNotifEmail] = useState('');
  const [notifEmailInput, setNotifEmailInput] = useState('');
  const [savingEmail, setSavingEmail] = useState(false);

  // Ebook downloads
  const [ebookDownloads, setEbookDownloads] = useState({ total: 0, downloads: [] });

  // Newsletter subscribers
  const [newsletterSubs, setNewsletterSubs] = useState({ total: 0, subscribers: [] });

  // API Keys
  const [apiKeys, setApiKeys] = useState([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [creatingKey, setCreatingKey] = useState(false);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState(null);
  const [copiedKeyId, setCopiedKeyId] = useState(null);
  const [copiedDocId, setCopiedDocId] = useState(null);
  const [expandedEndpoint, setExpandedEndpoint] = useState(null);

  // Add slot form
  const [addDate, setAddDate] = useState('');
  const [addTimes, setAddTimes] = useState([]);
  const [addingSlots, setAddingSlots] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const [message, setMessage] = useState({ text: '', type: '' });

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 4000);
  };

  /* ----- Data fetching ------------------------------------------- */
  const fetchAll = useCallback(async () => {
    if (!password) return;
    setLoading(true);
    try {
      const [sched, bkgs, notif, ebook, keys, nlSubs] = await Promise.all([
        api.adminGetSchedule(password),
        api.adminGetBookings(password),
        api.adminGetNotificationEmail(password),
        api.adminGetEbookDownloads(password),
        api.adminGetApiKeys(password),
        api.adminGetNewsletterSubscribers(password),
      ]);
      setSchedule(sched);
      setBookings(bkgs);
      setNotifEmail(notif.notificationEmail || '');
      setNotifEmailInput(notif.notificationEmail || '');
      setEbookDownloads(ebook);
      setApiKeys(keys);
      setNewsletterSubs(nlSubs);
    } catch {
      showMessage('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  }, [password]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  /* ----- Slot operations ----------------------------------------- */
  const handleAddSlots = async () => {
    if (!addDate || addTimes.length === 0) return;
    setAddingSlots(true);
    try {
      const newSlots = await api.adminAddSlots(password, addDate, addTimes);
      showMessage(`Added ${newSlots.length} time slot(s) for ${fmtDate(addDate)}`);
      setShowAddForm(false);
      setAddDate('');
      setAddTimes([]);
      fetchAll();
    } catch (err) {
      showMessage(err.message, 'error');
    } finally {
      setAddingSlots(false);
    }
  };

  const handleDeleteSlot = async (id) => {
    try {
      await api.adminDeleteSlot(password, id);
      showMessage('Slot deleted');
      fetchAll();
    } catch (err) {
      showMessage(err.message, 'error');
    }
  };

  const handleMarkContacted = async (id) => {
    try {
      await api.adminMarkContacted(password, id);
      showMessage('Marked as contacted');
      fetchAll();
    } catch (err) {
      showMessage(err.message, 'error');
    }
  };

  const toggleTime = (t) =>
    setAddTimes((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  /* ----- API Keys ------------------------------------------------ */
  const handleCreateApiKey = async () => {
    if (!newKeyName.trim()) return;
    setCreatingKey(true);
    try {
      const result = await api.adminCreateApiKey(password, newKeyName.trim());
      setNewlyCreatedKey(result);
      setNewKeyName('');
      fetchAll();
      showMessage('API key created! Copy it now — it won\'t be shown again.');
    } catch (err) {
      showMessage(err.message, 'error');
    } finally {
      setCreatingKey(false);
    }
  };

  const handleRevokeApiKey = async (id) => {
    try {
      await api.adminRevokeApiKey(password, id);
      showMessage('API key revoked');
      fetchAll();
    } catch (err) {
      showMessage(err.message, 'error');
    }
  };

  const copyToClipboard = async (text, id, type = 'key') => {
    await navigator.clipboard.writeText(text);
    if (type === 'key') {
      setCopiedKeyId(id);
      setTimeout(() => setCopiedKeyId(null), 2000);
    } else {
      setCopiedDocId(id);
      setTimeout(() => setCopiedDocId(null), 2000);
    }
  };

  /* ----- Notification email -------------------------------------- */
  const handleSaveNotifEmail = async () => {
    setSavingEmail(true);
    try {
      const res = await api.adminSetNotificationEmail(password, notifEmailInput.trim());
      setNotifEmail(res.notificationEmail || '');
      showMessage(notifEmailInput.trim() ? 'Notification email saved!' : 'Notification email cleared');
    } catch (err) {
      showMessage(err.message, 'error');
    } finally {
      setSavingEmail(false);
    }
  };

  /* ----- Not logged in ------------------------------------------- */
  if (!password) return <AdminLogin onLogin={setPassword} />;

  /* ----- Stats --------------------------------------------------- */
  const totalSlots = schedule.length;
  const bookedSlots = schedule.filter((s) => s.isBooked).length;
  const pendingContact = bookings.filter((b) => !b.contactedAt).length;
  const totalDownloads = ebookDownloads.total;

  /* ----- Group schedule by date ---------------------------------- */
  const scheduleByDate = {};
  schedule.forEach((s) => {
    if (!scheduleByDate[s.date]) scheduleByDate[s.date] = [];
    scheduleByDate[s.date].push(s);
  });
  const sortedDates = Object.keys(scheduleByDate).sort();

  /* ---------------------------------------------------------------- */
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="border-b border-[#1a1a1a]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-[#a0a0a0] hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#00ff88] to-[#00d4aa] flex items-center justify-center">
                <span className="text-[#0a0a0a] font-bold text-lg">E</span>
              </div>
              <div>
                <h1 className="font-bold text-base">Admin Dashboard</h1>
                <p className="text-[#666] text-xs">Manage schedule &amp; bookings</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchAll}
              disabled={loading}
              className="p-2 rounded-lg bg-[#1a1a1a] border border-[#333] text-[#a0a0a0] hover:text-white hover:border-[#00ff88]/50 transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setPassword(null)}
              className="text-xs text-[#666] hover:text-red-400 transition-colors"
            >
              Log out
            </button>
          </div>
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium shadow-lg ${
              message.type === 'error'
                ? 'bg-red-500/10 border-red-500/30 text-red-400'
                : 'bg-[#00ff88]/10 border-[#00ff88]/30 text-[#00ff88]'
            }`}
          >
            {message.type === 'error' ? (
              <AlertCircle className="w-4 h-4" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total Slots', value: totalSlots, icon: Calendar, color: '#00ff88' },
            { label: 'Booked', value: bookedSlots, icon: Users, color: '#00d4aa' },
            { label: 'Pending Contact', value: pendingContact, icon: Phone, color: '#ff6b35' },
            { label: 'Ebook Downloads', value: totalDownloads, icon: Download, color: '#60a5fa' },
            { label: 'Newsletter Subs', value: newsletterSubs.total, icon: Mail, color: '#a78bfa' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div
              key={label}
              className="bg-[#111] border border-[#222] rounded-xl p-5 flex items-center gap-4"
            >
              <div
                className="w-11 h-11 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${color}15` }}
              >
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <div>
                <p className="text-[#666] text-xs font-medium">{label}</p>
                <p className="text-2xl font-bold" style={{ color }}>
                  {value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-[#111] border border-[#222] rounded-xl p-1 mb-8 w-fit">
          {[
            { id: 'schedule', label: 'Schedule', icon: Calendar },
            { id: 'bookings', label: 'Bookings', icon: Users },
            { id: 'downloads', label: 'Downloads', icon: BookOpen },
            { id: 'newsletter', label: 'Newsletter', icon: Mail },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                tab === id
                  ? 'bg-[#00ff88] text-[#0a0a0a]'
                  : 'text-[#a0a0a0] hover:text-white hover:bg-[#1a1a1a]'
              }`}
            >
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>

        {/* ===================== SCHEDULE TAB ===================== */}
        {tab === 'schedule' && (
          <div>
            {/* Add slots */}
            <div className="mb-6">
              {!showAddForm ? (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#00ff88]/10 border border-[#00ff88]/30 text-[#00ff88] font-medium text-sm hover:bg-[#00ff88]/20 transition-all"
                >
                  <CalendarPlus className="w-4 h-4" /> Add Time Slots
                </button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#111] border border-[#222] rounded-2xl p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-base flex items-center gap-2">
                      <CalendarPlus className="w-5 h-5 text-[#00ff88]" /> Add Available Slots
                    </h3>
                    <button onClick={() => setShowAddForm(false)} className="text-[#666] hover:text-white">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm text-[#a0a0a0] mb-1.5">Date</label>
                    <input
                      type="date"
                      value={addDate}
                      onChange={(e) => setAddDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="bg-[#0a0a0a] border border-[#333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00ff88] transition-colors w-full max-w-xs"
                    />
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-sm text-[#a0a0a0]">Time Slots</label>
                      <button
                        onClick={() =>
                          setAddTimes((prev) =>
                            prev.length === DEFAULT_TIMES.length ? [] : [...DEFAULT_TIMES],
                          )
                        }
                        className="text-xs text-[#00ff88] hover:underline"
                      >
                        {addTimes.length === DEFAULT_TIMES.length ? 'Deselect All' : 'Select All'}
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {DEFAULT_TIMES.map((t) => (
                        <button
                          key={t}
                          onClick={() => toggleTime(t)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                            addTimes.includes(t)
                              ? 'bg-[#00ff88]/10 border-[#00ff88] text-[#00ff88]'
                              : 'border-[#333] text-[#a0a0a0] hover:border-[#00ff88]/50'
                          }`}
                        >
                          {formatTime12(t)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleAddSlots}
                    disabled={!addDate || addTimes.length === 0 || addingSlots}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
                      !addDate || addTimes.length === 0 || addingSlots
                        ? 'bg-[#1a1a1a] text-[#666] cursor-not-allowed'
                        : 'bg-gradient-to-r from-[#00ff88] to-[#00d4aa] text-[#0a0a0a] hover:shadow-[0_0_30px_rgba(0,255,136,0.4)]'
                    }`}
                  >
                    {addingSlots ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                    Add {addTimes.length} Slot{addTimes.length !== 1 ? 's' : ''}
                  </button>
                </motion.div>
              )}
            </div>

            {/* Schedule table */}
            {sortedDates.length === 0 ? (
              <div className="text-center py-16 bg-[#111] border border-[#222] rounded-2xl">
                <Calendar className="w-10 h-10 text-[#333] mx-auto mb-3" />
                <p className="text-[#666]">No time slots configured yet.</p>
                <p className="text-[#444] text-sm">Click "Add Time Slots" to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedDates.map((date) => (
                  <div key={date} className="bg-[#111] border border-[#222] rounded-xl overflow-hidden">
                    <div className="px-5 py-3 border-b border-[#1a1a1a] bg-[#0e0e0e] flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#00ff88]" />
                      <span className="font-semibold text-sm">{fmtDate(date)}</span>
                      <span className="ml-auto text-xs text-[#666]">
                        {scheduleByDate[date].length} slot(s)
                      </span>
                    </div>
                    <div className="divide-y divide-[#1a1a1a]">
                      {scheduleByDate[date]
                        .sort((a, b) => a.time.localeCompare(b.time))
                        .map((slot) => (
                          <div
                            key={slot.id}
                            className="px-5 py-3 flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <Clock className="w-4 h-4 text-[#666]" />
                              <span className="text-sm font-medium">{formatTime12(slot.time)}</span>
                              {slot.isBooked && (
                                <span className="text-xs bg-[#ff6b35]/10 text-[#ff6b35] px-2 py-0.5 rounded-full font-medium">
                                  Booked
                                </span>
                              )}
                            </div>
                            {!slot.isBooked && (
                              <button
                                onClick={() => handleDeleteSlot(slot.id)}
                                className="p-1.5 rounded-lg text-[#666] hover:text-red-400 hover:bg-red-400/10 transition-all"
                                title="Delete slot"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===================== BOOKINGS TAB ===================== */}
        {tab === 'bookings' && (
          <div>
            {bookings.length === 0 ? (
              <div className="text-center py-16 bg-[#111] border border-[#222] rounded-2xl">
                <Users className="w-10 h-10 text-[#333] mx-auto mb-3" />
                <p className="text-[#666]">No bookings yet.</p>
                <p className="text-[#444] text-sm">
                  Bookings will appear here when someone reserves a call.
                </p>
              </div>
            ) : (
              <div className="bg-[#111] border border-[#222] rounded-2xl overflow-hidden">
                {/* Desktop table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#222] text-left text-[#666] text-xs uppercase tracking-wider">
                        <th className="px-5 py-3 font-medium">Name</th>
                        <th className="px-5 py-3 font-medium">Email</th>
                        <th className="px-5 py-3 font-medium">Date</th>
                        <th className="px-5 py-3 font-medium">Time</th>
                        <th className="px-5 py-3 font-medium">Booked At</th>
                        <th className="px-5 py-3 font-medium">Status</th>
                        <th className="px-5 py-3 font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1a1a1a]">
                      {bookings.map((b) => (
                        <tr key={b.id} className="hover:bg-[#0e0e0e] transition-colors">
                          <td className="px-5 py-4 font-medium text-white">{b.name}</td>
                          <td className="px-5 py-4">
                            <a
                              href={`mailto:${b.email}`}
                              className="text-[#00ff88] hover:underline flex items-center gap-1.5"
                            >
                              <Mail className="w-3.5 h-3.5" /> {b.email}
                            </a>
                          </td>
                          <td className="px-5 py-4 text-[#a0a0a0]">{fmtDate(b.date)}</td>
                          <td className="px-5 py-4 text-[#a0a0a0]">{formatTime12(b.time)}</td>
                          <td className="px-5 py-4 text-[#666] text-xs">{fmtDateTime(b.createdAt)}</td>
                          <td className="px-5 py-4">
                            {b.contactedAt ? (
                              <span className="inline-flex items-center gap-1 text-xs bg-[#00ff88]/10 text-[#00ff88] px-2 py-1 rounded-full font-medium">
                                <CheckCircle2 className="w-3 h-3" /> Contacted
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs bg-[#ff6b35]/10 text-[#ff6b35] px-2 py-1 rounded-full font-medium">
                                <Clock className="w-3 h-3" /> Pending
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            {!b.contactedAt && (
                              <button
                                onClick={() => handleMarkContacted(b.id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#00ff88]/10 text-[#00ff88] hover:bg-[#00ff88]/20 transition-all"
                              >
                                <UserCheck className="w-3.5 h-3.5" /> Mark Contacted
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="md:hidden divide-y divide-[#1a1a1a]">
                  {bookings.map((b) => (
                    <div key={b.id} className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">{b.name}</span>
                        {b.contactedAt ? (
                          <span className="inline-flex items-center gap-1 text-xs bg-[#00ff88]/10 text-[#00ff88] px-2 py-1 rounded-full font-medium">
                            <CheckCircle2 className="w-3 h-3" /> Contacted
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs bg-[#ff6b35]/10 text-[#ff6b35] px-2 py-1 rounded-full font-medium">
                            <Clock className="w-3 h-3" /> Pending
                          </span>
                        )}
                      </div>
                      <a
                        href={`mailto:${b.email}`}
                        className="text-[#00ff88] text-sm hover:underline flex items-center gap-1"
                      >
                        <Mail className="w-3.5 h-3.5" /> {b.email}
                      </a>
                      <div className="flex items-center gap-4 text-xs text-[#666]">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {fmtDate(b.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {formatTime12(b.time)}
                        </span>
                      </div>
                      {!b.contactedAt && (
                        <button
                          onClick={() => handleMarkContacted(b.id)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-[#00ff88]/10 text-[#00ff88] hover:bg-[#00ff88]/20 transition-all mt-1"
                        >
                          <UserCheck className="w-3.5 h-3.5" /> Mark Contacted
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================== DOWNLOADS TAB ===================== */}
        {tab === 'downloads' && (
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-1">
                <BookOpen className="w-5 h-5 text-[#60a5fa]" /> Ebook Downloads
              </h2>
              <p className="text-[#666] text-sm">
                People who accessed the success page and downloaded the playbook.
              </p>
            </div>

            {ebookDownloads.downloads.length === 0 ? (
              <div className="text-center py-16 bg-[#111] border border-[#222] rounded-2xl">
                <Download className="w-10 h-10 text-[#333] mx-auto mb-3" />
                <p className="text-[#666]">No ebook downloads tracked yet.</p>
                <p className="text-[#444] text-sm">Downloads will appear here when someone accesses the playbook page.</p>
              </div>
            ) : (
              <div className="bg-[#111] border border-[#222] rounded-2xl overflow-hidden">
                <div className="px-5 py-3 border-b border-[#1a1a1a] bg-[#0e0e0e] flex items-center justify-between">
                  <span className="text-sm font-medium text-[#a0a0a0]">
                    Total: <span className="text-[#60a5fa] font-bold">{ebookDownloads.total}</span> download{ebookDownloads.total !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* Desktop table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#222] text-left text-[#666] text-xs uppercase tracking-wider">
                        <th className="px-5 py-3 font-medium">#</th>
                        <th className="px-5 py-3 font-medium">Email</th>
                        <th className="px-5 py-3 font-medium">Downloaded At</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1a1a1a]">
                      {ebookDownloads.downloads.map((d, i) => (
                        <tr key={d.id} className="hover:bg-[#0e0e0e] transition-colors">
                          <td className="px-5 py-4 text-[#666]">{i + 1}</td>
                          <td className="px-5 py-4">
                            <a
                              href={`mailto:${d.email}`}
                              className="text-[#60a5fa] hover:underline flex items-center gap-1.5"
                            >
                              <Mail className="w-3.5 h-3.5" /> {d.email}
                            </a>
                          </td>
                          <td className="px-5 py-4 text-[#666] text-xs">{fmtDateTime(d.downloadedAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="md:hidden divide-y divide-[#1a1a1a]">
                  {ebookDownloads.downloads.map((d, i) => (
                    <div key={d.id} className="p-4 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#666]">#{i + 1}</span>
                        <span className="text-xs text-[#666]">{fmtDateTime(d.downloadedAt)}</span>
                      </div>
                      <a
                        href={`mailto:${d.email}`}
                        className="text-[#60a5fa] text-sm hover:underline flex items-center gap-1"
                      >
                        <Mail className="w-3.5 h-3.5" /> {d.email}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================== NEWSLETTER TAB ===================== */}
        {tab === 'newsletter' && (
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-1">
                <Mail className="w-5 h-5 text-[#a78bfa]" /> Newsletter Subscribers
              </h2>
              <p className="text-[#666] text-sm">
                {newsletterSubs.total} subscriber{newsletterSubs.total !== 1 ? 's' : ''} have joined your newsletter.
              </p>
            </div>

            {newsletterSubs.subscribers.length > 0 ? (
              <div className="bg-[#111] border border-[#222] rounded-2xl overflow-hidden">
                {/* Desktop table */}
                <div className="hidden sm:block">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#222] text-left text-[#666] text-xs uppercase tracking-wider bg-[#0e0e0e]">
                        <th className="px-5 py-3 font-medium">#</th>
                        <th className="px-5 py-3 font-medium">Email</th>
                        <th className="px-5 py-3 font-medium">YouTube Channel</th>
                        <th className="px-5 py-3 font-medium">Registered</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1a1a1a]">
                      {newsletterSubs.subscribers.map((s, idx) => (
                        <tr key={s.id} className="hover:bg-[#0e0e0e] transition-colors">
                          <td className="px-5 py-3 text-[#666] text-xs">{idx + 1}</td>
                          <td className="px-5 py-3">
                            <span className="flex items-center gap-2">
                              <Mail className="w-3.5 h-3.5 text-[#a78bfa]" />
                              <span className="text-white font-medium">{s.email}</span>
                            </span>
                          </td>
                          <td className="px-5 py-3">
                            {s.channelUrl ? (
                              <a
                                href={s.channelUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#60a5fa] hover:underline text-xs truncate block max-w-[250px]"
                              >
                                {s.channelUrl}
                              </a>
                            ) : (
                              <span className="text-[#444] text-xs">Not provided</span>
                            )}
                          </td>
                          <td className="px-5 py-3 text-[#666] text-xs">{fmtDateTime(s.registeredAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Mobile cards */}
                <div className="sm:hidden divide-y divide-[#1a1a1a]">
                  {newsletterSubs.subscribers.map((s) => (
                    <div key={s.id} className="p-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-[#a78bfa]" />
                        <span className="text-white font-medium text-sm">{s.email}</span>
                      </div>
                      {s.channelUrl && (
                        <a
                          href={s.channelUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#60a5fa] hover:underline text-xs block truncate"
                        >
                          {s.channelUrl}
                        </a>
                      )}
                      <p className="text-[#666] text-xs">{fmtDateTime(s.registeredAt)}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-[#111] border border-[#222] rounded-2xl">
                <Mail className="w-10 h-10 text-[#333] mx-auto mb-3" />
                <p className="text-[#666] text-sm">No newsletter subscribers yet.</p>
              </div>
            )}
          </div>
        )}

        {/* ===================== SETTINGS TAB ===================== */
        {tab === 'settings' && (
          <div className="space-y-8">
            <div className="mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-1">
                <Settings className="w-5 h-5 text-[#a78bfa]" /> Settings
              </h2>
              <p className="text-[#666] text-sm">Configure your admin preferences and API access.</p>
            </div>

            {/* --- Notification Email --- */}
            <div className="bg-[#111] border border-[#222] rounded-2xl p-6 max-w-lg">
              <h3 className="font-semibold text-base flex items-center gap-2 mb-1">
                <Mail className="w-4 h-4 text-[#00ff88]" /> Booking Notification Email
              </h3>
              <p className="text-[#666] text-sm mb-4">
                Receive an email notification whenever someone books a call. Leave empty to disable.
              </p>

              <div className="flex gap-3">
                <input
                  type="email"
                  value={notifEmailInput}
                  onChange={(e) => setNotifEmailInput(e.target.value)}
                  placeholder="you@example.com"
                  className="flex-1 bg-[#0a0a0a] border border-[#333] rounded-xl px-4 py-3 text-white placeholder:text-[#444] focus:outline-none focus:border-[#00ff88] transition-colors text-sm"
                />
                <button
                  onClick={handleSaveNotifEmail}
                  disabled={savingEmail || notifEmailInput === notifEmail}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all ${
                    savingEmail || notifEmailInput === notifEmail
                      ? 'bg-[#1a1a1a] text-[#666] cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#00ff88] to-[#00d4aa] text-[#0a0a0a] hover:shadow-[0_0_30px_rgba(0,255,136,0.4)]'
                  }`}
                >
                  {savingEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save
                </button>
              </div>

              {notifEmail && (
                <p className="mt-3 text-xs text-[#666] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff88]" />
                  Currently sending notifications to: <span className="text-[#00ff88]">{notifEmail}</span>
                </p>
              )}
            </div>

            {/* --- API Keys Section --- */}
            <div className="bg-[#111] border border-[#222] rounded-2xl p-6">
              <h3 className="font-semibold text-base flex items-center gap-2 mb-1">
                <Key className="w-4 h-4 text-[#f59e0b]" /> API Keys
              </h3>
              <p className="text-[#666] text-sm mb-5">
                Create API keys to access your data programmatically. Keys authenticate via <code className="bg-[#1a1a1a] px-1.5 py-0.5 rounded text-[#60a5fa] text-xs">Authorization: Bearer &lt;key&gt;</code> header.
              </p>

              {/* Create new key */}
              <div className="flex gap-3 mb-6">
                <input
                  type="text"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="Key name (e.g. My Integration)"
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateApiKey()}
                  className="flex-1 bg-[#0a0a0a] border border-[#333] rounded-xl px-4 py-3 text-white placeholder:text-[#444] focus:outline-none focus:border-[#f59e0b] transition-colors text-sm"
                />
                <button
                  onClick={handleCreateApiKey}
                  disabled={creatingKey || !newKeyName.trim()}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all ${
                    creatingKey || !newKeyName.trim()
                      ? 'bg-[#1a1a1a] text-[#666] cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#f59e0b] to-[#f97316] text-[#0a0a0a] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]'
                  }`}
                >
                  {creatingKey ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  Create Key
                </button>
              </div>

              {/* Newly created key banner */}
              {newlyCreatedKey && (
                <div className="mb-6 bg-[#f59e0b]/10 border border-[#f59e0b]/30 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-[#f59e0b]" />
                      <span className="font-semibold text-sm text-[#f59e0b]">
                        Save your API key now — it won't be shown again!
                      </span>
                    </div>
                    <button
                      onClick={() => setNewlyCreatedKey(null)}
                      className="text-[#666] hover:text-white p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-[#00ff88] text-xs font-mono break-all select-all">
                      {newlyCreatedKey.rawKey}
                    </code>
                    <button
                      onClick={() => copyToClipboard(newlyCreatedKey.rawKey, 'new', 'key')}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-[#1a1a1a] text-white hover:bg-[#222] transition-all shrink-0"
                    >
                      {copiedKeyId === 'new' ? <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff88]" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedKeyId === 'new' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              )}

              {/* Key list */}
              {apiKeys.length > 0 && (
                <div className="border border-[#222] rounded-xl overflow-hidden mb-6">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#222] text-left text-[#666] text-xs uppercase tracking-wider bg-[#0e0e0e]">
                        <th className="px-4 py-2.5 font-medium">Name</th>
                        <th className="px-4 py-2.5 font-medium">Key Prefix</th>
                        <th className="px-4 py-2.5 font-medium">Status</th>
                        <th className="px-4 py-2.5 font-medium">Last Used</th>
                        <th className="px-4 py-2.5 font-medium">Created</th>
                        <th className="px-4 py-2.5 font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1a1a1a]">
                      {apiKeys.map((k) => (
                        <tr key={k.id} className="hover:bg-[#0e0e0e] transition-colors">
                          <td className="px-4 py-3 font-medium text-white">{k.name}</td>
                          <td className="px-4 py-3">
                            <code className="text-[#a0a0a0] text-xs font-mono">{k.keyPrefix}...</code>
                          </td>
                          <td className="px-4 py-3">
                            {k.isActive ? (
                              <span className="inline-flex items-center gap-1 text-xs bg-[#00ff88]/10 text-[#00ff88] px-2 py-0.5 rounded-full font-medium">
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs bg-red-400/10 text-red-400 px-2 py-0.5 rounded-full font-medium">
                                Revoked
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-[#666] text-xs">
                            {k.lastUsedAt ? fmtDateTime(k.lastUsedAt) : 'Never'}
                          </td>
                          <td className="px-4 py-3 text-[#666] text-xs">{fmtDateTime(k.createdAt)}</td>
                          <td className="px-4 py-3">
                            {k.isActive && (
                              <button
                                onClick={() => handleRevokeApiKey(k.id)}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:bg-red-400/10 transition-all"
                              >
                                <Trash2 className="w-3 h-3" /> Revoke
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {apiKeys.length === 0 && (
                <div className="text-center py-8 bg-[#0e0e0e] border border-[#1a1a1a] rounded-xl mb-6">
                  <Key className="w-8 h-8 text-[#333] mx-auto mb-2" />
                  <p className="text-[#666] text-sm">No API keys yet. Create one above to get started.</p>
                </div>
              )}

              {/* ============ API Documentation ============ */}
              <div className="border-t border-[#222] pt-6">
                <h3 className="font-semibold text-base flex items-center gap-2 mb-1">
                  <FileText className="w-4 h-4 text-[#60a5fa]" /> API Documentation
                </h3>
                <p className="text-[#666] text-sm mb-5">
                  All endpoints use <code className="bg-[#1a1a1a] px-1.5 py-0.5 rounded text-[#60a5fa] text-xs">Authorization: Bearer &lt;your-api-key&gt;</code> header for authentication. Base URL: <code className="bg-[#1a1a1a] px-1.5 py-0.5 rounded text-[#a78bfa] text-xs">{window.location.origin}</code>
                </p>

                <div className="space-y-3">
                  {[
                    {
                      id: 'stats',
                      method: 'GET',
                      path: '/api/v1/stats',
                      title: 'Dashboard Statistics',
                      description: 'Get an overview of all application statistics: total slots, available slots, bookings, contacted/pending bookings, and ebook downloads.',
                      params: 'None',
                      response: `{
  "totalSlots": 24,
  "availableSlots": 12,
  "totalBookings": 8,
  "contactedBookings": 5,
  "pendingBookings": 3,
  "totalEbookDownloads": 42
}`,
                      curl: `curl -X GET '${window.location.origin}/api/v1/stats' \\
  -H 'Authorization: Bearer YOUR_API_KEY'`,
                    },
                    {
                      id: 'schedule-list',
                      method: 'GET',
                      path: '/api/v1/schedule',
                      title: 'List Schedule Slots',
                      description: 'Retrieve all time slots. Filter by date or availability status.',
                      params: 'Query params: ?date=YYYY-MM-DD (optional), ?available=true|false (optional)',
                      response: `{
  "total": 12,
  "slots": [
    {
      "id": "abc123",
      "date": "2026-03-15",
      "time": "09:00",
      "isBooked": false,
      "createdAt": "2026-03-01T10:00:00Z"
    }
  ]
}`,
                      curl: `curl -X GET '${window.location.origin}/api/v1/schedule?available=true' \\
  -H 'Authorization: Bearer YOUR_API_KEY'`,
                    },
                    {
                      id: 'schedule-create',
                      method: 'POST',
                      path: '/api/v1/schedule',
                      title: 'Create Time Slots',
                      description: 'Add new time slots for a specific date. Duplicate times are silently skipped.',
                      params: 'Body (JSON): { "date": "YYYY-MM-DD", "times": ["HH:mm", "HH:mm", ...] }',
                      response: `{
  "created": [
    {
      "id": "abc123",
      "date": "2026-03-15",
      "time": "09:00",
      "createdAt": "2026-03-01T10:00:00Z"
    }
  ]
}`,
                      curl: `curl -X POST '${window.location.origin}/api/v1/schedule' \\
  -H 'Authorization: Bearer YOUR_API_KEY' \\
  -H 'Content-Type: application/json' \\
  -d '{"date":"2026-03-15","times":["09:00","09:30","10:00"]}'`,
                    },
                    {
                      id: 'schedule-delete',
                      method: 'DELETE',
                      path: '/api/v1/schedule/:id',
                      title: 'Delete Time Slot',
                      description: 'Delete an unbooked time slot by its ID. Booked slots cannot be deleted.',
                      params: 'URL param: :id (slot ID)',
                      response: `{ "success": true }`,
                      curl: `curl -X DELETE '${window.location.origin}/api/v1/schedule/SLOT_ID' \\
  -H 'Authorization: Bearer YOUR_API_KEY'`,
                    },
                    {
                      id: 'bookings-list',
                      method: 'GET',
                      path: '/api/v1/bookings',
                      title: 'List Bookings',
                      description: 'Retrieve all reservations/bookings. Filter by status.',
                      params: 'Query params: ?status=contacted|pending (optional)',
                      response: `{
  "total": 8,
  "bookings": [
    {
      "id": "def456",
      "slotId": "abc123",
      "name": "John Doe",
      "email": "john@example.com",
      "date": "2026-03-15",
      "time": "09:00",
      "createdAt": "2026-03-10T14:30:00Z",
      "contactedAt": null
    }
  ]
}`,
                      curl: `curl -X GET '${window.location.origin}/api/v1/bookings?status=pending' \\
  -H 'Authorization: Bearer YOUR_API_KEY'`,
                    },
                    {
                      id: 'bookings-detail',
                      method: 'GET',
                      path: '/api/v1/bookings/:id',
                      title: 'Get Booking Details',
                      description: 'Retrieve a single booking/reservation by its ID.',
                      params: 'URL param: :id (booking ID)',
                      response: `{
  "id": "def456",
  "slotId": "abc123",
  "name": "John Doe",
  "email": "john@example.com",
  "date": "2026-03-15",
  "time": "09:00",
  "createdAt": "2026-03-10T14:30:00Z",
  "contactedAt": null
}`,
                      curl: `curl -X GET '${window.location.origin}/api/v1/bookings/BOOKING_ID' \\
  -H 'Authorization: Bearer YOUR_API_KEY'`,
                    },
                    {
                      id: 'bookings-contacted',
                      method: 'PATCH',
                      path: '/api/v1/bookings/:id/contacted',
                      title: 'Mark Booking as Contacted',
                      description: 'Mark a reservation as contacted. Sets a contactedAt timestamp.',
                      params: 'URL param: :id (booking ID)',
                      response: `{
  "id": "def456",
  "contactedAt": "2026-03-11T09:00:00Z",
  "success": true
}`,
                      curl: `curl -X PATCH '${window.location.origin}/api/v1/bookings/BOOKING_ID/contacted' \\
  -H 'Authorization: Bearer YOUR_API_KEY'`,
                    },
                    {
                      id: 'downloads-list',
                      method: 'GET',
                      path: '/api/v1/downloads',
                      title: 'List Ebook Downloads',
                      description: 'Retrieve all ebook/playbook download records with emails and timestamps.',
                      params: 'None',
                      response: `{
  "total": 42,
  "downloads": [
    {
      "id": "ghi789",
      "email": "reader@example.com",
      "downloadedAt": "2026-03-08T16:45:00Z"
    }
  ]
}`,
                      curl: `curl -X GET '${window.location.origin}/api/v1/downloads' \\
  -H 'Authorization: Bearer YOUR_API_KEY'`,
                    },
                  ].map((endpoint) => {
                    const methodColors = {
                      GET: 'bg-[#00ff88]/10 text-[#00ff88] border-[#00ff88]/20',
                      POST: 'bg-[#60a5fa]/10 text-[#60a5fa] border-[#60a5fa]/20',
                      DELETE: 'bg-red-400/10 text-red-400 border-red-400/20',
                      PATCH: 'bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20',
                      PUT: 'bg-[#a78bfa]/10 text-[#a78bfa] border-[#a78bfa]/20',
                    };

                    const fullDoc = `# ${endpoint.title}

**${endpoint.method}** \`${endpoint.path}\`

${endpoint.description}

## Authentication
\`\`\`
Authorization: Bearer YOUR_API_KEY
\`\`\`

## Parameters
${endpoint.params}

## Example Request
\`\`\`bash
${endpoint.curl}
\`\`\`

## Example Response
\`\`\`json
${endpoint.response}
\`\`\`
`;

                    return (
                      <div
                        key={endpoint.id}
                        className="border border-[#222] rounded-xl overflow-hidden"
                      >
                        <button
                          onClick={() => setExpandedEndpoint(expandedEndpoint === endpoint.id ? null : endpoint.id)}
                          className="w-full flex items-center gap-3 px-4 py-3 bg-[#0e0e0e] hover:bg-[#151515] transition-colors text-left"
                        >
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${methodColors[endpoint.method]}`}>
                            {endpoint.method}
                          </span>
                          <code className="text-sm text-[#a0a0a0] font-mono flex-1">{endpoint.path}</code>
                          <span className="text-xs text-[#666] hidden sm:inline">{endpoint.title}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(fullDoc, endpoint.id, 'doc');
                            }}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-[#1a1a1a] hover:bg-[#252525] text-[#a78bfa] transition-all shrink-0 border border-[#333]"
                            title="Copy documentation as Markdown for AI"
                          >
                            {copiedDocId === endpoint.id ? (
                              <><CheckCircle2 className="w-3 h-3 text-[#00ff88]" /> Copied!</>
                            ) : (
                              <><Clipboard className="w-3 h-3" /> Copy for AI</>
                            )}
                          </button>
                          {expandedEndpoint === endpoint.id
                            ? <ChevronDown className="w-4 h-4 text-[#666] shrink-0" />
                            : <ChevronRight className="w-4 h-4 text-[#666] shrink-0" />
                          }
                        </button>

                        <AnimatePresence>
                          {expandedEndpoint === endpoint.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 py-4 space-y-4 border-t border-[#222] bg-[#0a0a0a]">
                                <p className="text-[#a0a0a0] text-sm">{endpoint.description}</p>

                                <div>
                                  <span className="text-xs font-semibold text-[#666] uppercase tracking-wider">Parameters</span>
                                  <p className="text-sm text-[#a0a0a0] mt-1">{endpoint.params}</p>
                                </div>

                                <div>
                                  <span className="text-xs font-semibold text-[#666] uppercase tracking-wider">cURL Example</span>
                                  <div className="relative mt-1">
                                    <pre className="bg-[#111] border border-[#222] rounded-lg p-3 text-xs text-[#a0a0a0] font-mono overflow-x-auto whitespace-pre-wrap">
                                      {endpoint.curl}
                                    </pre>
                                    <button
                                      onClick={() => copyToClipboard(endpoint.curl, `curl-${endpoint.id}`, 'doc')}
                                      className="absolute top-2 right-2 p-1.5 rounded-md bg-[#1a1a1a] hover:bg-[#252525] text-[#666] hover:text-white transition-all"
                                      title="Copy cURL command"
                                    >
                                      {copiedDocId === `curl-${endpoint.id}`
                                        ? <CheckCircle2 className="w-3 h-3 text-[#00ff88]" />
                                        : <Copy className="w-3 h-3" />
                                      }
                                    </button>
                                  </div>
                                </div>

                                <div>
                                  <span className="text-xs font-semibold text-[#666] uppercase tracking-wider">Response Example</span>
                                  <pre className="bg-[#111] border border-[#222] rounded-lg p-3 mt-1 text-xs text-[#00ff88] font-mono overflow-x-auto whitespace-pre-wrap">
                                    {endpoint.response}
                                  </pre>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>

                {/* Copy All Documentation */}
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={() => {
                      const allDocs = `# EEC API Documentation

**Base URL:** ${window.location.origin}
**Authentication:** All endpoints require an API key sent via the Authorization header.

\`\`\`
Authorization: Bearer YOUR_API_KEY
\`\`\`

---

${[
  { method: 'GET', path: '/api/v1/stats', title: 'Dashboard Statistics', description: 'Get an overview of all application statistics.', params: 'None' },
  { method: 'GET', path: '/api/v1/schedule', title: 'List Schedule Slots', description: 'Retrieve all time slots. Filter by date or availability.', params: '?date=YYYY-MM-DD, ?available=true|false' },
  { method: 'POST', path: '/api/v1/schedule', title: 'Create Time Slots', description: 'Add new time slots for a date.', params: 'Body: { "date": "YYYY-MM-DD", "times": ["HH:mm"] }' },
  { method: 'DELETE', path: '/api/v1/schedule/:id', title: 'Delete Time Slot', description: 'Delete an unbooked time slot.', params: ':id (slot ID)' },
  { method: 'GET', path: '/api/v1/bookings', title: 'List Bookings', description: 'Retrieve all reservations.', params: '?status=contacted|pending' },
  { method: 'GET', path: '/api/v1/bookings/:id', title: 'Get Booking Details', description: 'Get a single booking by ID.', params: ':id (booking ID)' },
  { method: 'PATCH', path: '/api/v1/bookings/:id/contacted', title: 'Mark Booking as Contacted', description: 'Mark a reservation as contacted.', params: ':id (booking ID)' },
  { method: 'GET', path: '/api/v1/downloads', title: 'List Ebook Downloads', description: 'Retrieve all ebook download records.', params: 'None' },
].map((e) => `## ${e.title}\n\n**${e.method}** \`${e.path}\`\n\n${e.description}\n\n**Parameters:** ${e.params}\n`).join('\n---\n\n')}`;
                      copyToClipboard(allDocs, 'all-docs', 'doc');
                    }}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm bg-[#a78bfa]/10 border border-[#a78bfa]/30 text-[#a78bfa] hover:bg-[#a78bfa]/20 transition-all"
                  >
                    {copiedDocId === 'all-docs' ? (
                      <><CheckCircle2 className="w-4 h-4 text-[#00ff88]" /> Copied All Documentation!</>
                    ) : (
                      <><Clipboard className="w-4 h-4" /> Copy All API Docs for AI</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

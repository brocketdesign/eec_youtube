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
  const [tab, setTab] = useState('schedule'); // schedule | bookings | downloads | settings
  const [schedule, setSchedule] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  // Notification email
  const [notifEmail, setNotifEmail] = useState('');
  const [notifEmailInput, setNotifEmailInput] = useState('');
  const [savingEmail, setSavingEmail] = useState(false);

  // Ebook downloads
  const [ebookDownloads, setEbookDownloads] = useState({ total: 0, downloads: [] });

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
      const [sched, bkgs, notif, ebook] = await Promise.all([
        api.adminGetSchedule(password),
        api.adminGetBookings(password),
        api.adminGetNotificationEmail(password),
        api.adminGetEbookDownloads(password),
      ]);
      setSchedule(sched);
      setBookings(bkgs);
      setNotifEmail(notif.notificationEmail || '');
      setNotifEmailInput(notif.notificationEmail || '');
      setEbookDownloads(ebook);
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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Slots', value: totalSlots, icon: Calendar, color: '#00ff88' },
            { label: 'Booked', value: bookedSlots, icon: Users, color: '#00d4aa' },
            { label: 'Pending Contact', value: pendingContact, icon: Phone, color: '#ff6b35' },
            { label: 'Ebook Downloads', value: totalDownloads, icon: Download, color: '#60a5fa' },
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

        {/* ===================== SETTINGS TAB ===================== */}
        {tab === 'settings' && (
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-1">
                <Settings className="w-5 h-5 text-[#a78bfa]" /> Settings
              </h2>
              <p className="text-[#666] text-sm">Configure your admin preferences.</p>
            </div>

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
          </div>
        )}
      </div>
    </div>
  );
}

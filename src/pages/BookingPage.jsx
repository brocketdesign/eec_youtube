import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Mail,
  User,
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Phone,
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

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];
const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

/* ------------------------------------------------------------------ */
/*  BookingPage                                                        */
/* ------------------------------------------------------------------ */
export default function BookingPage() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Calendar view month
  const [viewDate, setViewDate] = useState(new Date());

  useEffect(() => {
    api
      .getAvailableSlots()
      .then(setSlots)
      .catch(() => setError('Failed to load available times'))
      .finally(() => setLoading(false));
  }, []);

  /* dates that have at least one slot ----------------------------- */
  const availableDates = useMemo(() => {
    const set = new Set(slots.map((s) => s.date));
    return set;
  }, [slots]);

  /* slots for the selected date ----------------------------------- */
  const slotsForDate = useMemo(() => {
    if (!selectedDate) return [];
    const dateStr = selectedDate.toISOString().split('T')[0];
    return slots
      .filter((s) => s.date === dateStr)
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [slots, selectedDate]);

  /* calendar grid ------------------------------------------------- */
  const calendarDays = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days = [];
    // blanks
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({
        date,
        dateStr,
        isPast: date < today,
        hasSlots: availableDates.has(dateStr),
      });
    }
    return days;
  }, [viewDate, availableDates]);

  const prevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const nextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));

  /* submit -------------------------------------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSlot) return;
    setSubmitting(true);
    setError('');

    try {
      await api.createBooking({ slotId: selectedSlot.id, name, email });
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------------------------------------------------------------- */
  /*  Render                                                          */
  /* ---------------------------------------------------------------- */

  // --- Success screen ---
  if (success) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-[#1a1a1a] border border-[#333] rounded-2xl p-8 text-center"
        >
          <div className="w-16 h-16 mx-auto bg-[#00ff88]/10 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-8 h-8 text-[#00ff88]" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">You're Booked!</h2>
          <p className="text-[#a0a0a0] mb-2">
            Thank you for your reservation, <span className="text-white font-medium">{name}</span>.
          </p>
          <p className="text-[#a0a0a0] mb-6">
            We're going to contact you shortly. A confirmation email has been sent
            to <span className="text-[#00ff88]">{email}</span>.
          </p>
          <div className="bg-[#0a0a0a] rounded-xl p-4 border border-[#222] mb-6">
            <p className="text-[#00ff88] text-xs uppercase tracking-wider mb-2 font-semibold">
              Call Details
            </p>
            <p className="text-white font-semibold text-lg">
              {selectedSlot && new Date(selectedSlot.date + 'T00:00:00').toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <p className="text-white font-semibold text-lg">
              {selectedSlot && formatTime12(selectedSlot.time)}
            </p>
            <p className="text-[#666] text-sm mt-1">15-Minute Strategy Call</p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[#00ff88] hover:text-[#00d4aa] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="border-b border-[#1a1a1a]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center gap-4">
          <Link to="/" className="text-[#a0a0a0] hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00ff88] to-[#00d4aa] flex items-center justify-center">
              <span className="text-[#0a0a0a] font-bold text-xl">E</span>
            </div>
            <div>
              <h1 className="font-bold text-lg">Book a 15-Min Call</h1>
              <p className="text-[#666] text-sm">Pick a time that works for you</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Feature badges */}
        <div className="flex flex-wrap gap-4 justify-center mb-10">
          {[
            { icon: Phone, text: '15-Min Strategy Call' },
            { icon: User, text: 'One-on-One Session' },
            { icon: CheckCircle2, text: 'No Strings Attached' },
          ].map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-2 bg-[#1a1a1a] border border-[#222] rounded-full px-4 py-2 text-sm text-[#a0a0a0]"
            >
              <Icon className="w-4 h-4 text-[#00ff88]" />
              {text}
            </div>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#00ff88] mx-auto mb-4" />
            <p className="text-[#a0a0a0]">Loading available times…</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_380px] gap-8 max-w-5xl mx-auto">
            {/* Left: Calendar + time slots */}
            <div className="bg-[#111] border border-[#222] rounded-2xl overflow-hidden">
              {/* Calendar header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#222]">
                <button
                  onClick={prevMonth}
                  className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors text-[#a0a0a0] hover:text-white"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="text-lg font-semibold">
                  {MONTH_NAMES[viewDate.getMonth()]} {viewDate.getFullYear()}
                </h2>
                <button
                  onClick={nextMonth}
                  className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors text-[#a0a0a0] hover:text-white"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Calendar grid */}
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {DAY_NAMES.map((d) => (
                    <div key={d} className="text-center text-xs font-medium text-[#666] py-2">
                      {d}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, i) =>
                    day === null ? (
                      <div key={`blank-${i}`} />
                    ) : (
                      <button
                        key={day.dateStr}
                        disabled={day.isPast || !day.hasSlots}
                        onClick={() => {
                          setSelectedDate(day.date);
                          setSelectedSlot(null);
                        }}
                        className={`
                          relative aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all
                          ${day.isPast || !day.hasSlots
                            ? 'text-[#444] cursor-not-allowed'
                            : selectedDate && isSameDay(day.date, selectedDate)
                              ? 'bg-[#00ff88] text-[#0a0a0a] font-bold shadow-[0_0_20px_rgba(0,255,136,0.3)]'
                              : 'text-white hover:bg-[#1a1a1a] cursor-pointer'
                          }
                        `}
                      >
                        {day.date.getDate()}
                        {day.hasSlots && !day.isPast && !(selectedDate && isSameDay(day.date, selectedDate)) && (
                          <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#00ff88] rounded-full" />
                        )}
                      </button>
                    ),
                  )}
                </div>
              </div>

              {/* Time slots for selected date */}
              <AnimatePresence mode="wait">
                {selectedDate && (
                  <motion.div
                    key={selectedDate.toISOString()}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-[#222] overflow-hidden"
                  >
                    <div className="p-4 sm:p-6">
                      <h3 className="text-sm font-semibold text-[#a0a0a0] mb-3 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#00ff88]" />
                        Available Times —{' '}
                        {selectedDate.toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </h3>
                      {slotsForDate.length === 0 ? (
                        <p className="text-[#666] text-sm">No times available for this date.</p>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {slotsForDate.map((slot) => (
                            <button
                              key={slot.id}
                              onClick={() => setSelectedSlot(slot)}
                              className={`
                                py-3 px-4 rounded-xl text-sm font-medium transition-all border
                                ${selectedSlot?.id === slot.id
                                  ? 'bg-[#00ff88]/10 border-[#00ff88] text-[#00ff88] shadow-[0_0_15px_rgba(0,255,136,0.15)]'
                                  : 'border-[#333] text-white hover:border-[#00ff88]/50 hover:bg-[#1a1a1a]'
                                }
                              `}
                            >
                              {formatTime12(slot.time)}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right: Booking form */}
            <div>
              <div className="bg-[#111] border border-[#222] rounded-2xl p-6 sticky top-24">
                <h3 className="text-lg font-bold mb-1">Your Details</h3>
                <p className="text-[#666] text-sm mb-6">
                  Fill in your info and pick a time slot to confirm your call.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-[#a0a0a0] mb-1.5">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-[#444] focus:outline-none focus:border-[#00ff88] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-[#a0a0a0] mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-[#444] focus:outline-none focus:border-[#00ff88] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Selected slot summary */}
                  {selectedSlot && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-[#00ff88]/5 border border-[#00ff88]/20 rounded-xl p-4"
                    >
                      <p className="text-[#00ff88] text-xs uppercase tracking-wider font-semibold mb-1">
                        Selected Time
                      </p>
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-[#00ff88] shrink-0" />
                        <span className="text-white text-sm font-medium">
                          {selectedDate?.toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                        <Clock className="w-4 h-4 text-[#00ff88] shrink-0" />
                        <span className="text-white text-sm font-medium">
                          {formatTime12(selectedSlot.time)}
                        </span>
                      </div>
                    </motion.div>
                  )}

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={!selectedSlot || !name || !email || submitting}
                    className={`
                      w-full py-3.5 rounded-xl font-semibold text-base transition-all flex items-center justify-center gap-2
                      ${!selectedSlot || !name || !email || submitting
                        ? 'bg-[#1a1a1a] text-[#666] cursor-not-allowed'
                        : 'bg-gradient-to-r from-[#00ff88] to-[#00d4aa] text-[#0a0a0a] hover:shadow-[0_0_30px_rgba(0,255,136,0.4)] hover:-translate-y-0.5'
                      }
                    `}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" /> Booking…
                      </>
                    ) : (
                      'Confirm Booking'
                    )}
                  </button>
                </form>

                <p className="text-[#444] text-xs text-center mt-4">
                  By booking, you agree to receive a confirmation email at the address provided.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

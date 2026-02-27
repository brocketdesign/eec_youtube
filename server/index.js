import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { Resend } from 'resend';
import path from 'path';
import { fileURLToPath } from 'url';
import { getPlaybookEmailHtml } from './email-template.js';
import Admin from './models/Admin.js';
import Slot from './models/Slot.js';
import Booking from './models/Booking.js';
import EbookDownload from './models/EbookDownload.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// ---------------------------------------------------------------------------
// MongoDB connection
// ---------------------------------------------------------------------------
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('❌ MONGO_URI is not set in .env');
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// ---------------------------------------------------------------------------
// Resend & middleware
// ---------------------------------------------------------------------------
const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.FROM_EMAIL || 'EEC Marketing <eecmarketing@vibedash.net>';

app.use(cors());
app.use(express.json());

// Serve static files from the React frontend build
app.use(express.static(path.join(__dirname, '../dist')));

// ---------------------------------------------------------------------------
// Admin auth middleware — validates password against hashed DB record
// ---------------------------------------------------------------------------
const adminAuth = async (req, res, next) => {
  const password = req.headers['x-admin-password'];
  if (!password) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const admin = await Admin.findOne({});
    if (!admin) return res.status(401).json({ error: 'No admin configured' });
    const valid = await admin.comparePassword(password);
    if (!valid) return res.status(401).json({ error: 'Unauthorized' });
    req.admin = admin;
    next();
  } catch {
    res.status(500).json({ error: 'Auth error' });
  }
};

// ---------------------------------------------------------------------------
// Email helpers
// ---------------------------------------------------------------------------
const formatTimeForEmail = (time24) => {
  const [h, m] = time24.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${period}`;
};

const formatDateForEmail = (dateStr) => {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

// ---------------------------------------------------------------------------
// EXISTING ROUTES
// ---------------------------------------------------------------------------

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

// Send playbook email
app.post('/api/send-playbook', async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: 'Email is required' });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return res.status(400).json({ error: 'Invalid email address' });

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [email],
      subject: '🎮 Your Free EEC Playbook is Here — Build Your Gaming Empire!',
      html: getPlaybookEmailHtml(email),
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ error: 'Failed to send email' });
    }

    console.log(`✅ Playbook email sent to ${email} — ID: ${data.id}`);
    return res.json({ success: true, messageId: data.id });
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ---------------------------------------------------------------------------
// BOOKING — PUBLIC ROUTES
// ---------------------------------------------------------------------------

// Get available (unbooked, future) time slots
app.get('/api/schedule/available', async (_req, res) => {
  try {
    const now = new Date();
    // Get all slot IDs that already have a booking
    const bookedSlotIds = (await Booking.find({}, 'slot').lean()).map((b) => b.slot);

    const available = await Slot.find({
      _id: { $nin: bookedSlotIds },
      $expr: {
        $gt: [{ $dateFromString: { dateString: { $concat: ['$date', 'T', '$time'] } } }, now],
      },
    })
      .sort({ date: 1, time: 1 })
      .lean();

    // Map _id → id for frontend
    res.json(
      available.map((s) => ({
        id: s._id.toString(),
        date: s.date,
        time: s.time,
        createdAt: s.createdAt,
      })),
    );
  } catch (err) {
    console.error('Error fetching schedule:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a booking
app.post('/api/bookings', async (req, res) => {
  try {
    const { slotId, name, email } = req.body;

    if (!slotId || !name || !email) {
      return res.status(400).json({ error: 'Name, email, and time slot are required' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    const slot = await Slot.findById(slotId);
    if (!slot) return res.status(404).json({ error: 'Time slot not found' });

    const existing = await Booking.findOne({ slot: slotId });
    if (existing) return res.status(409).json({ error: 'This time slot is already booked' });

    const booking = await Booking.create({
      slot: slot._id,
      name,
      email,
      date: slot.date,
      time: slot.time,
    });

    // Send confirmation email
    const fDate = formatDateForEmail(slot.date);
    const fTime = formatTimeForEmail(slot.time);

    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: [email],
        subject: 'Your 15-Minute Call is Booked!',
        html: `
          <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #ffffff; padding: 40px; border-radius: 16px; border: 1px solid #222222;">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="display: inline-block; width: 48px; height: 48px; background: linear-gradient(135deg, #00ff88, #00d4aa); border-radius: 12px; line-height: 48px; font-weight: bold; font-size: 22px; color: #0a0a0a;">E</div>
            </div>
            <h1 style="color: #00ff88; text-align: center; font-size: 24px; margin-bottom: 8px;">Thank You for Your Reservation!</h1>
            <p style="color: #a0a0a0; text-align: center; font-size: 16px; margin-bottom: 4px;">Hi ${name},</p>
            <p style="color: #a0a0a0; text-align: center; font-size: 16px; margin-bottom: 30px;">We're going to contact you shortly.</p>
            <div style="background: #1a1a1a; border: 1px solid #333333; border-radius: 12px; padding: 24px; text-align: center;">
              <p style="color: #00ff88; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 12px;">Your Call Details</p>
              <p style="color: #ffffff; font-size: 20px; font-weight: bold; margin: 0 0 4px;">${fDate}</p>
              <p style="color: #ffffff; font-size: 20px; font-weight: bold; margin: 0 0 8px;">at ${fTime}</p>
              <p style="color: #666666; font-size: 14px; margin: 0;">15-Minute Strategy Call</p>
            </div>
            <p style="color: #444444; text-align: center; font-size: 12px; margin-top: 30px;">&copy; EEC &mdash; All rights reserved</p>
          </div>
        `,
      });
      console.log(`✅ Booking confirmation email sent to ${email}`);
    } catch (emailErr) {
      console.error('Email sending failed:', emailErr.message);
    }

    // Send admin notification email
    try {
      const admin = await Admin.findOne({});
      if (admin?.notificationEmail) {
        const fDateAdmin = formatDateForEmail(slot.date);
        const fTimeAdmin = formatTimeForEmail(slot.time);
        await resend.emails.send({
          from: FROM_EMAIL,
          to: [admin.notificationEmail],
          subject: `📅 New Booking: ${name} — ${fDateAdmin} at ${fTimeAdmin}`,
          html: `
            <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #ffffff; padding: 40px; border-radius: 16px; border: 1px solid #222222;">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="display: inline-block; width: 48px; height: 48px; background: linear-gradient(135deg, #00ff88, #00d4aa); border-radius: 12px; line-height: 48px; font-weight: bold; font-size: 22px; color: #0a0a0a;">E</div>
              </div>
              <h1 style="color: #00ff88; text-align: center; font-size: 24px; margin-bottom: 8px;">New Booking Received!</h1>
              <p style="color: #a0a0a0; text-align: center; font-size: 16px; margin-bottom: 30px;">A new 15-minute call has been reserved.</p>
              <div style="background: #1a1a1a; border: 1px solid #333333; border-radius: 12px; padding: 24px;">
                <p style="color: #00ff88; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 16px;">Booking Details</p>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr><td style="color: #666; padding: 6px 0; font-size: 14px;">Name</td><td style="color: #fff; padding: 6px 0; font-size: 14px; text-align: right;">${name}</td></tr>
                  <tr><td style="color: #666; padding: 6px 0; font-size: 14px;">Email</td><td style="color: #00ff88; padding: 6px 0; font-size: 14px; text-align: right;"><a href="mailto:${email}" style="color: #00ff88; text-decoration: none;">${email}</a></td></tr>
                  <tr><td style="color: #666; padding: 6px 0; font-size: 14px;">Date</td><td style="color: #fff; padding: 6px 0; font-size: 14px; text-align: right;">${fDateAdmin}</td></tr>
                  <tr><td style="color: #666; padding: 6px 0; font-size: 14px;">Time</td><td style="color: #fff; padding: 6px 0; font-size: 14px; text-align: right;">${fTimeAdmin}</td></tr>
                </table>
              </div>
              <p style="color: #444444; text-align: center; font-size: 12px; margin-top: 30px;">&copy; EEC &mdash; Admin Notification</p>
            </div>
          `,
        });
        console.log(`✅ Admin notification sent to ${admin.notificationEmail}`);
      }
    } catch (notifErr) {
      console.error('Admin notification email failed:', notifErr.message);
    }

    res.status(201).json(booking.toJSON());
  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ---------------------------------------------------------------------------
// BOOKING — ADMIN ROUTES
// ---------------------------------------------------------------------------

// Admin login — verify password against hashed DB record
app.post('/api/admin/login', async (req, res) => {
  const { password } = req.body;
  try {
    const admin = await Admin.findOne({});
    if (!admin) return res.status(401).json({ error: 'No admin configured' });
    const valid = await admin.comparePassword(password);
    if (!valid) return res.status(401).json({ error: 'Invalid password' });
    res.json({ success: true, admin: admin.toSafeJSON() });
  } catch {
    res.status(500).json({ error: 'Login error' });
  }
});

// Get all schedule slots (enriched with booking status)
app.get('/api/admin/schedule', adminAuth, async (_req, res) => {
  try {
    const slots = await Slot.find({}).sort({ date: 1, time: 1 }).lean();
    const bookedSlotIds = new Set(
      (await Booking.find({}, 'slot').lean()).map((b) => b.slot.toString()),
    );

    const enriched = slots.map((s) => ({
      id: s._id.toString(),
      date: s.date,
      time: s.time,
      createdAt: s.createdAt,
      isBooked: bookedSlotIds.has(s._id.toString()),
    }));

    res.json(enriched);
  } catch (err) {
    console.error('Error fetching admin schedule:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add time slots for a date
app.post('/api/admin/schedule', adminAuth, async (req, res) => {
  try {
    const { date, times } = req.body;
    if (!date || !Array.isArray(times) || times.length === 0) {
      return res.status(400).json({ error: 'Date and times array are required' });
    }

    const existing = await Slot.find({ date }, 'time').lean();
    const existingTimes = new Set(existing.map((s) => s.time));

    const toInsert = times
      .filter((t) => !existingTimes.has(t))
      .map((time) => ({ date, time }));

    const newSlots = await Slot.insertMany(toInsert, { ordered: false }).catch((err) => {
      // ignore duplicate key errors (concurrent inserts)
      if (err.code === 11000) return err.insertedDocs || [];
      throw err;
    });

    res.status(201).json(
      (Array.isArray(newSlots) ? newSlots : []).map((s) => ({
        id: s._id.toString(),
        date: s.date,
        time: s.time,
        createdAt: s.createdAt,
      })),
    );
  } catch (err) {
    console.error('Error adding schedule:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a time slot
app.delete('/api/admin/schedule/:id', adminAuth, async (req, res) => {
  try {
    const booked = await Booking.findOne({ slot: req.params.id });
    if (booked) return res.status(409).json({ error: 'Cannot delete a booked slot' });

    const deleted = await Slot.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Slot not found' });

    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting slot:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all bookings
app.get('/api/admin/bookings', adminAuth, async (_req, res) => {
  try {
    const bookings = await Booking.find({}).sort({ createdAt: -1 }).lean();
    res.json(
      bookings.map((b) => ({
        id: b._id.toString(),
        slotId: b.slot.toString(),
        name: b.name,
        email: b.email,
        date: b.date,
        time: b.time,
        createdAt: b.createdAt,
        contactedAt: b.contactedAt || null,
      })),
    );
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mark booking as contacted
app.patch('/api/admin/bookings/:id/contacted', adminAuth, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { contactedAt: new Date() },
      { new: true },
    );
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking.toJSON());
  } catch (err) {
    console.error('Error updating booking:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ---------------------------------------------------------------------------
// ADMIN — Notification email
// ---------------------------------------------------------------------------

// Get notification email
app.get('/api/admin/notification-email', adminAuth, async (req, res) => {
  try {
    res.json({ notificationEmail: req.admin.notificationEmail || '' });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Set notification email
app.put('/api/admin/notification-email', adminAuth, async (req, res) => {
  try {
    const { email } = req.body;
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }
    req.admin.notificationEmail = email || '';
    await req.admin.save();
    res.json({ success: true, notificationEmail: req.admin.notificationEmail });
  } catch (err) {
    console.error('Error saving notification email:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ---------------------------------------------------------------------------
// EBOOK DOWNLOAD TRACKING
// ---------------------------------------------------------------------------

// Track an ebook download (called from SuccessPage)
app.post('/api/ebook-downloads', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Valid email is required' });
    }
    await EbookDownload.findOneAndUpdate(
      { email },
      { email, downloadedAt: new Date() },
      { upsert: true, new: true },
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Error tracking ebook download:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: get all ebook downloads
app.get('/api/admin/ebook-downloads', adminAuth, async (_req, res) => {
  try {
    const downloads = await EbookDownload.find({}).sort({ downloadedAt: -1 }).lean();
    res.json({
      total: downloads.length,
      downloads: downloads.map((d) => ({
        id: d._id.toString(),
        email: d.email,
        downloadedAt: d.downloadedAt,
      })),
    });
  } catch (err) {
    console.error('Error fetching ebook downloads:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ---------------------------------------------------------------------------
// Catch-all handler: serve React app for any non-API route
// ---------------------------------------------------------------------------
app.get('/*', (req, res) => {
  // Don't interfere with API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// ---------------------------------------------------------------------------
// Start server
// ---------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`🚀 EEC API server running on http://localhost:${PORT}`);
});

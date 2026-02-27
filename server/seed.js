/**
 * Seed script — creates the initial admin user in MongoDB.
 *
 * Usage:
 *   node server/seed.js
 *
 * Reads MONGO_URI from .env (via dotenv).
 * Default credentials (change after first login!):
 *   username : admin
 *   email    : admin@eec.com
 *   password : admin123
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import Admin from './models/Admin.js';
import Slot from './models/Slot.js';

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('❌  MONGO_URI is not set in .env');
  process.exit(1);
}

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_EMAIL    = process.env.ADMIN_EMAIL    || 'admin@eec.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

/**
 * Generate slots for the next `numDays` weekdays at the given times.
 */
function generateSlots(numDays = 10, times = ['10:00', '11:00', '14:00', '15:00', '16:00']) {
  const slots = [];
  const today = new Date();
  let added = 0;
  let offset = 1; // start from tomorrow

  while (added < numDays) {
    const d = new Date(today);
    d.setDate(today.getDate() + offset);
    const day = d.getDay(); // 0=Sun, 6=Sat
    if (day !== 0 && day !== 6) {
      const dateStr = d.toISOString().split('T')[0]; // YYYY-MM-DD
      for (const time of times) {
        slots.push({ date: dateStr, time });
      }
      added++;
    }
    offset++;
  }
  return slots;
}

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB');

  // --- Admin ---
  const existing = await Admin.findOne({ username: ADMIN_USERNAME });
  if (existing) {
    console.log(`ℹ️  Admin "${ADMIN_USERNAME}" already exists — skipping.`);
  } else {
    await Admin.create({
      username: ADMIN_USERNAME,
      email: ADMIN_EMAIL,
      passwordHash: ADMIN_PASSWORD,       // hashed automatically by pre-save hook
    });
    console.log(`✅ Admin user created:`);
    console.log(`   Username : ${ADMIN_USERNAME}`);
    console.log(`   Email    : ${ADMIN_EMAIL}`);
    console.log(`   Password : ${ADMIN_PASSWORD}`);
  }

  // --- Slots ---
  const existingSlots = await Slot.countDocuments();
  if (existingSlots > 0) {
    console.log(`ℹ️  ${existingSlots} slot(s) already exist — skipping slot seed.`);
  } else {
    const slots = generateSlots();
    await Slot.insertMany(slots);
    console.log(`✅ ${slots.length} slots created (${slots.length / 5} weekdays × 5 time slots each)`);
  }

  await mongoose.disconnect();
  console.log('✅ Done');
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});

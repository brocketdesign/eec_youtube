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

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('❌  MONGO_URI is not set in .env');
  process.exit(1);
}

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_EMAIL    = process.env.ADMIN_EMAIL    || 'admin@eec.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB');

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

  await mongoose.disconnect();
  console.log('✅ Done');
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});

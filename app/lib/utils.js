import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config();

export async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function hashOTP(otp) {
  return crypto.createHash('sha256').update(otp).digest('hex');
}

export function verifyOTP(otp, hash) {
  return hashOTP(otp) === hash;
}

export function generateRandomToken(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

export function generateToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };
  const secret = process.env.JWT_SECRET || 'dev_jwt_secret';
  return jwt.sign(payload, secret, { expiresIn: '24h' });
}

export const INDONESIAN_LABELS = {
  // Roles
  admin: 'Admin',
  recruiter: 'Recruiter',
  participant: 'Peserta',

  // Status
  active: 'Aktif',
  inactive: 'Tidak Aktif',
  not_started: 'Belum Dimulai',
  in_progress: 'Sedang Berlangsung',
  completed: 'Selesai',
  expired: 'Kadaluarsa',

  // Gender
  male: 'Laki-laki',
  female: 'Perempuan',
  other: 'Lainnya',

  // OTP Channel
  email: 'Email',
  whatsapp: 'WhatsApp',

  // Question Types
  multiple_choice: 'Pilihan Ganda',
  true_false: 'Benar / Salah',
  likert_scale: 'Skala Likert',
  image_based: 'Berbasis Gambar',
  essay: 'Esai',
  drawing: 'Gambar',
  forced_choice: 'Pilihan Paksa',
  numeric: 'Angka',
};

export function getLabel(key) {
  return INDONESIAN_LABELS[key] || key;
}

export default {
  hashPassword,
  verifyPassword,
  generateOTP,
  hashOTP,
  verifyOTP,
  generateRandomToken,
  generateToken,
  getLabel,
  INDONESIAN_LABELS,
};

import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { generateOTP, hashOTP } from '../../../../lib/utils';
import { z } from 'zod';

const OtpRequestSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().min(6).optional(),
}).refine((d) => d.email || d.phone, { message: 'email or phone required' });
import { config } from 'dotenv';

config();

// Simple in-memory rate limiting (use Redis in production)
const otpRequests = new Map();

function checkRateLimit(participantEmail) {
  const key = `otp_${participantEmail}`;
  const now = Date.now();
  const cooldownMs = parseInt(process.env.OTP_COOLDOWN_MINUTES || 2) * 60 * 1000;

  if (otpRequests.has(key)) {
    const lastRequest = otpRequests.get(key);
    if (now - lastRequest < cooldownMs) {
      const remainingSeconds = Math.ceil((cooldownMs - (now - lastRequest)) / 1000);
      throw new Error(`Tunggu ${remainingSeconds} detik sebelum meminta OTP baru`);
    }
  }

  otpRequests.set(key, now);
  return true;
}

export const POST = async (request) => {
  try {
    const body = await request.json();
    const parse = OtpRequestSchema.safeParse(body);
    if (!parse.success) return NextResponse.json({ error: 'Invalid payload', details: parse.error.flatten() }, { status: 400 });
    const { email, phone } = parse.data;

    const identifier = email || phone;

    // Check rate limit
    checkRateLimit(identifier);

    // Find participant
    let participant = null;
    if (email) {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || user.status !== 'active') {
        return NextResponse.json({ error: 'Peserta tidak ditemukan atau tidak aktif' }, { status: 404 });
      }
      participant = await prisma.participant.findUnique({ where: { userId: user.id } });
    } else {
      participant = await prisma.participant.findFirst({ where: { phone } , include: { user: true } });
      if (!participant || participant.user.status !== 'active') {
        return NextResponse.json({ error: 'Peserta tidak ditemukan atau tidak aktif' }, { status: 404 });
      }
    }

    // Generate OTP
    const otp = generateOTP();
    const otpHash = hashOTP(otp);
    const expiryMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES || 5);
    const expiryTime = new Date(Date.now() + expiryMinutes * 60 * 1000);

    // Store OTP in database
    await prisma.participantOtp.create({
      data: {
        participantId: participant.id,
        otpHash,
        channel: email ? 'email' : 'whatsapp',
        expiresAt: expiryTime,
      },
    });

    // TODO: Send OTP via email or WhatsApp
    // For development, log the OTP
    console.log(`OTP untuk ${identifier}: ${otp}`);

    return NextResponse.json({
      message: 'OTP telah dikirim',
      identifier,
      expiryMinutes,
      // Debug only - remove in production
      debug_otp: process.env.NODE_ENV === 'development' ? otp : undefined,
    });
  } catch (error) {
    console.error('OTP generation error:', error);
    
    if (error.message.includes('Tunggu')) {
      return NextResponse.json({ error: error.message }, { status: 429 });
    }

    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}

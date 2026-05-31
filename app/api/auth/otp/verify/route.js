import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { generateToken, verifyOTP } from '../../../../app/lib/utils';
import { config } from 'dotenv';
import { z } from 'zod';

config();

// In-memory rate limiting for OTP verification
const verifyAttempts = new Map();

const OtpVerifySchema = z.object({
  otp: z.string().min(4),
  email: z.string().email().optional(),
  phone: z.string().min(6).optional(),
}).refine((d) => d.email || d.phone, { message: 'email or phone required' });

export async function POST(request) {
  try {
    const body = await request.json();
    const parse = OtpVerifySchema.safeParse(body);
    if (!parse.success) return NextResponse.json({ error: 'Invalid payload', details: parse.error.flatten() }, { status: 400 });
    const { email, phone, otp } = parse.data;

    const identifier = email || phone;
    const attemptsKey = \`verify_\${identifier}\`;
    const maxAttempts = parseInt(process.env.OTP_MAX_ATTEMPTS || 5);

    // Check rate limiting
    const attempts = verifyAttempts.get(attemptsKey) || 0;
    if (attempts >= maxAttempts) {
      return NextResponse.json(
        { error: 'Terlalu banyak percobaan. Coba lagi nanti.' },
        { status: 429 }
      );
    }

    // Find participant
    let participant = null;
    if (email) {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || user.status !== 'active') {
        return NextResponse.json({ error: 'Peserta tidak ditemukan' }, { status: 404 });
      }
      participant = await prisma.participant.findUnique({ where: { userId: user.id } });
    } else {
      participant = await prisma.participant.findFirst({ where: { phone }, include: { user: true } });
      if (!participant || participant.user.status !== 'active') {
        return NextResponse.json({ error: 'Peserta tidak ditemukan' }, { status: 404 });
      }
    }

    // Get latest OTP
    const otpRecord = await prisma.participantOtp.findFirst({
      where: {
        participantId: participant.id,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRecord) {
      return NextResponse.json({ error: 'OTP tidak ditemukan atau sudah kadaluarsa' }, { status: 400 });
    }

    // Verify OTP
    if (!verifyOTP(otp, otpRecord.otpHash)) {
      verifyAttempts.set(attemptsKey, attempts + 1);
      return NextResponse.json({ error: 'OTP salah' }, { status: 401 });
    }

    // Mark OTP as used
    await prisma.participantOtp.update({ where: { id: otpRecord.id }, data: { used: true } });

    // Get user data
    const user = await prisma.user.findUnique({ where: { id: participant.userId } });

    // Generate JWT token
    const token = generateToken(user);

    // Clear verification attempts
    verifyAttempts.delete(attemptsKey);

    const response = NextResponse.json({
      message: 'Login berhasil',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        participantId: participant.id,
      },
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      maxAge: 86400,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}

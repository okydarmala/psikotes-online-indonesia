import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { generateToken, verifyOTP } from '../../../../lib/utils';
import { config } from 'dotenv';
import { z } from 'zod';
import { encode } from 'next-auth/jwt';
import jwt from 'jsonwebtoken';

config();

// In-memory rate limiting for OTP verification
const verifyAttempts = new Map();

const OtpVerifySchema = z.object({
  otp: z.string().min(4),
  email: z.string().email().optional(),
  phone: z.string().min(6).optional(),
}).refine((d) => d.email || d.phone, { message: 'email or phone required' });

export const POST = async (request) => {
  try {
    const reqBody = await request.json();
    const parse = OtpVerifySchema.safeParse(reqBody);
    if (!parse.success) return NextResponse.json({ error: 'Invalid payload', details: parse.error.flatten() }, { status: 400 });
    const { email, phone, otp } = parse.data;

    const identifier = email || phone;
    const attemptsKey = `verify_${identifier}`;
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

    // Prepare NextAuth-style JWT so client `useSession()` can recognize the session.
    let nextAuthEncoded = null;
    try {
      const maxAge = 24 * 60 * 60; // match NextAuth session maxAge
      const now = Math.floor(Date.now() / 1000);
      const nextAuthToken = {
        name: user.name,
        email: user.email,
        sub: String(user.id),
        iat: now,
        exp: now + maxAge,
        role: user.role,
      };

      const secret = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET;
      // Try next-auth encode first; if it returns falsy, fallback to jsonwebtoken
      try {
        nextAuthEncoded = await encode({ token: nextAuthToken, secret, maxAge });
      } catch (e) {
        console.error('next-auth encode error:', e);
      }
      if (!nextAuthEncoded) {
        try {
          nextAuthEncoded = jwt.sign(nextAuthToken, secret, { expiresIn: maxAge });
        } catch (err) {
          console.error('jwt sign fallback error:', err);
        }
      }
    } catch (e) {
      console.error('NextAuth token encode error:', e);
    }

    // Clear verification attempts
    verifyAttempts.delete(attemptsKey);

    const body = {
      message: 'Login berhasil',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        participantId: participant.id,
      },
    };

    // Build Set-Cookie headers manually to ensure both cookies are sent.
    const cookies = [];
    const cookieValue = nextAuthEncoded || token;
    const tokenCookie = `token=${cookieValue}; Path=/; HttpOnly; Max-Age=86400`;
    cookies.push(['Set-Cookie', tokenCookie]);

    if (nextAuthEncoded) {
      const naCookie = `next-auth.session-token=${nextAuthEncoded}; Path=/; HttpOnly; Max-Age=${24 * 60 * 60}; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
      cookies.push(['Set-Cookie', naCookie]);
    }

    return new NextResponse(JSON.stringify(body), {
      status: 200,
      headers: cookies.concat([['Content-Type', 'application/json']]),
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}

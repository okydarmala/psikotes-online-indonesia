import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { verifyPassword, generateToken } from '../../../lib/utils';
import { z } from 'zod';

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(request) {
  try {
    const body = await request.json();
    const parse = LoginSchema.safeParse(body);
    if (!parse.success) return NextResponse.json({ error: 'Invalid payload', details: parse.error.flatten() }, { status: 400 });
    const { email, password } = parse.data;

    const user = await prisma.user.findFirst({
      where: {
        email,
        role: {
          in: ['admin', 'recruiter'],
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Email atau password salah' }, { status: 401 });
    }

    const passwordMatch = await verifyPassword(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json({ error: 'Email atau password salah' }, { status: 401 });
    }

    if (user.status === 'inactive') {
      return NextResponse.json({ error: 'Akun Anda tidak aktif' }, { status: 403 });
    }

    const token = generateToken(user);

    const response = NextResponse.json({
      message: 'Login berhasil',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      maxAge: 86400,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    
    // Check for database connection error
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      return NextResponse.json({ 
        error: 'Database tidak terhubung. Pastikan MySQL berjalan dan konfigurasi .env benar.' 
      }, { status: 503 });
    }
    
    if (error.code === 'ECONNREFUSED') {
      return NextResponse.json({ 
        error: 'Koneksi MySQL ditolak. Pastikan MySQL service berjalan.' 
      }, { status: 503 });
    }
    
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}

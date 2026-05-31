import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

export async function GET(request) {
  try {
    const userCount = await prisma.user.count();
    return NextResponse.json({
      status: 'ok',
      message: 'Database connection works',
      userCount,
    });
  } catch (error) {
    console.error('Test error:', error);
    return NextResponse.json({ error: 'Database connection failed', details: error.message }, { status: 500 });
  }
}

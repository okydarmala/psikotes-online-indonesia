import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';
import { hashPassword } from '../../../app/lib/utils';

export async function GET(request) {
  try {
    const participants = await prisma.participant.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });

    // map to previous shape (include status)
    const result = participants.map((p) => ({
      ...p,
      status: p.user?.status || null,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching participants:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const {
      full_name,
      email,
      phone,
      gender,
      birth_date,
      education,
      position_applied,
      company_name,
      notes,
      created_by,
    } = data;

    if (!full_name || !email) {
      return NextResponse.json(
        { error: 'Nama dan email peserta diperlukan' },
        { status: 400 }
      );
    }

    // Create user account
    const tempPassword = Math.random().toString(36).slice(-8);
    const passwordHash = await hashPassword(tempPassword);

    const user = await prisma.user.create({
      data: {
        name: full_name,
        email,
        password: passwordHash,
        role: 'participant',
        status: 'active',
      },
    });

    // Create participant
    const participant = await prisma.participant.create({
      data: {
        userId: user.id,
        phone,
        position: position_applied,
        education,
        status: 'pending',
        // store other fields in notes or extend model as needed
      },
    });

    return NextResponse.json({ message: 'Peserta berhasil didaftarkan', id: participant.id, temp_password: tempPassword }, { status: 201 });
  } catch (error) {
    console.error('Error creating participant:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}

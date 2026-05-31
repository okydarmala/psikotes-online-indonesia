import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { generateRandomToken } from '../../../../app/lib/utils';

export async function GET(request, { params }) {
  try {
    const { id } = params;

    const participant = await prisma.participant.findUnique({
      where: { id: Number(id) },
      include: { user: true },
    });

    if (!participant) {
      return NextResponse.json({ error: 'Peserta tidak ditemukan' }, { status: 404 });
    }

    // Get assigned tests
    const assignments = await prisma.testAssignment.findMany({
      where: { participantId: Number(id) },
      include: { testCategory: true },
      orderBy: { createdAt: 'desc' },
    });

    const result = { ...participant, assignments };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching participant:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}

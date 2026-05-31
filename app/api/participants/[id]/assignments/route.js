import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET(request, { params }) {
  try {
    const { id } = params;

    const assignments = await prisma.testAssignment.findMany({
      where: { participantId: Number(id) },
      include: { testCategory: { select: { name: true, durationMinutes: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(assignments);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();
    const { category_id, assigned_by } = data;

    if (!category_id || !assigned_by) {
      return NextResponse.json({ error: 'Kategori tes dan ID pengguna diperlukan' }, { status: 400 });
    }

    const existing = await prisma.testAssignment.findFirst({
      where: { participantId: Number(id), testCategoryId: Number(category_id) },
    });

    if (existing) {
      return NextResponse.json({ error: 'Peserta sudah ditugaskan tes ini' }, { status: 400 });
    }

    const created = await prisma.testAssignment.create({
      data: {
        participantId: Number(id),
        testCategoryId: Number(category_id),
        recruiterId: Number(assigned_by),
        status: 'not_started',
      },
    });

    return NextResponse.json({ message: 'Tes berhasil ditugaskan', id: created.id }, { status: 201 });
  } catch (error) {
    console.error('Error assigning test:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function GET(request) {
  try {
    const tests = await prisma.testCategory.findMany({ where: { }, orderBy: { name: 'asc' } });
    return NextResponse.json(tests);
  } catch (error) {
    console.error('Error fetching tests:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const {
      name,
      description,
      instructions,
      example_question,
      example_answer,
      time_limit_minutes,
    } = data;

    if (!name || !time_limit_minutes) {
      return NextResponse.json(
        { error: 'Nama kategori dan waktu limit diperlukan' },
        { status: 400 }
      );
    }

    const category = await prisma.testCategory.create({
      data: {
        name,
        description,
        durationMinutes: time_limit_minutes || null,
      },
    });

    return NextResponse.json({ message: 'Kategori tes berhasil dibuat', id: category.id }, { status: 201 });
  } catch (error) {
    console.error('Error creating test:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}

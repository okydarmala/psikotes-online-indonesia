import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET(request, { params }) {
  try {
    const { id } = params;

    const test = await prisma.testCategory.findUnique({
      where: { id: Number(id) },
      include: { TestSubcategories: true },
    });

    if (!test) {
      return NextResponse.json({ error: 'Kategori tes tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json(test);
  } catch (error) {
    console.error('Error fetching test:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET(request, { params }) {
  try {
    const { resultId } = params;

    const result = await prisma.testResult.findUnique({
      where: { id: Number(resultId) },
      include: { testCategory: true },
    });

    if (!result) {
      return NextResponse.json({ error: 'Hasil tidak ditemukan' }, { status: 404 });
    }

    const interpretation = await prisma.scoreInterpretation.findFirst({
      where: {
        testCategoryId: result.testCategoryId,
        scoreMin: { lte: result.totalScore ?? 0 },
        scoreMax: { gte: result.totalScore ?? 0 },
      },
    });

    if (interpretation) {
      result.interpretation = interpretation.interpretation;
      result.recommendation = interpretation.recommendation;
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching result:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}

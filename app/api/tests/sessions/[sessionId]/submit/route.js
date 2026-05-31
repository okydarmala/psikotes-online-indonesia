import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function POST(request, { params }) {
  try {
    const { sessionId } = params;
    if (!sessionId || Number.isNaN(Number(sessionId))) {
      return NextResponse.json({ error: 'sessionId invalid' }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      const session = await tx.testSession.findUnique({
        where: { id: Number(sessionId) },
        include: { testAssignment: true },
      });

      if (!session) throw new Error('Session tidak ditemukan');

      const answeredCount = await tx.participantAnswer.count({ where: { testSessionId: Number(sessionId) } });

      const categoryId = session.testAssignment?.testCategoryId || session.testAssignment?.testCategory?.id;
      const totalCount = await tx.question.count({ where: { testSubcategory: { testCategoryId: categoryId } } });

      const durationSeconds = Math.floor((Date.now() - new Date(session.startedAt).getTime()) / 1000);

      await tx.testSession.update({ where: { id: Number(sessionId) }, data: { status: 'completed', endedAt: new Date(), totalQuestions: totalCount } });

      const createdResult = await tx.testResult.create({
        data: {
          testSessionId: session.id,
          participantId: session.participantId,
          testCategoryId: categoryId,
          totalScore: 0,
          status: 'completed',
          completedAt: new Date(),
        },
      });

      await tx.testAssignment.update({ where: { id: session.testAssignmentId }, data: { status: 'completed', completedAt: new Date() } });

      return {
        message: 'Tes berhasil diselesaikan',
        result: {
          id: createdResult.id,
          totalQuestions: totalCount,
          answeredQuestions: answeredCount,
          durationSeconds,
        },
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error submitting test:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}

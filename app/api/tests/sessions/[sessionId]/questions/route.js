import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function GET(request, { params }) {
  try {
    const { sessionId } = params;

    const session = await prisma.testSession.findUnique({
      where: { id: Number(sessionId) },
      include: { testAssignment: true },
    });

    if (!session) {
      return NextResponse.json({ error: 'Session tidak ditemukan' }, { status: 404 });
    }

    const categoryId = session.testAssignment.testCategoryId;

    // find subcategories and their questions
    const subcats = await prisma.testSubcategory.findMany({ where: { testCategoryId: categoryId } });
    const subcatIds = subcats.map((s) => s.id);

    const questions = await prisma.question.findMany({
      where: { testSubcategoryId: { in: subcatIds } },
      orderBy: { displayOrder: 'asc' },
      include: { options: true },
    });

    const answers = await prisma.participantAnswer.findMany({ where: { testSessionId: Number(sessionId) } });

    const questionsWithOptions = questions.map((q) => {
      const userAnswer = answers.find((a) => a.questionId === q.id) || null;
      return {
        id: q.id,
        testSubcategoryId: q.testSubcategoryId,
        questionText: q.questionText,
        questionType: q.questionType,
        imageUrl: q.imageUrl,
        displayOrder: q.displayOrder,
        options: q.options,
        userAnswer,
      };
    });

    return NextResponse.json({
      session,
      questions: questionsWithOptions,
      totalQuestions: questions.length,
      answeredQuestions: answers.length,
    });
  } catch (error) {
    console.error('Error fetching test questions:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}

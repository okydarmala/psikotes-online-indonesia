import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function GET(request, { params }) {
  try {
    const { id } = params;

    // Find subcategories for this category
    const subcats = await prisma.testSubcategory.findMany({ where: { testCategoryId: Number(id) } });
    const subcatIds = subcats.map((s) => s.id);

    const questions = await prisma.question.findMany({
      where: { testSubcategoryId: { in: subcatIds } },
      orderBy: { displayOrder: 'asc' },
      include: { options: true },
    });

    const mapped = questions.map((q) => ({
      id: q.id,
      testSubcategoryId: q.testSubcategoryId,
      questionText: q.questionText,
      questionType: q.questionType,
      imageUrl: q.imageUrl,
      displayOrder: q.displayOrder,
      createdAt: q.createdAt,
      updatedAt: q.updatedAt,
      option_count: q.options ? q.options.length : 0,
    }));

    return NextResponse.json(mapped);
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const { id } = params; // category id
    const data = await request.json();
    const {
      testSubcategoryId,
      question_text,
      question_type,
      image_url,
      order_number,
      options,
    } = data;

    if (!question_text || !testSubcategoryId) {
      return NextResponse.json({ error: 'Teks pertanyaan dan testSubcategoryId diperlukan' }, { status: 400 });
    }

    const created = await prisma.question.create({
      data: {
        testSubcategoryId: Number(testSubcategoryId),
        questionText: question_text,
        questionType: question_type || 'multiple_choice',
        imageUrl: image_url || null,
        displayOrder: order_number || 1,
      },
    });

    if (options && Array.isArray(options) && options.length > 0) {
      const opts = options.map((opt, idx) => ({
        questionId: created.id,
        optionText: opt.text || null,
        optionValue: opt.value ? String(opt.value) : String(idx + 1),
        isCorrect: !!opt.is_correct,
        displayOrder: idx + 1,
      }));
      await prisma.questionOption.createMany({ data: opts });
    }

    return NextResponse.json({ message: 'Pertanyaan berhasil dibuat', id: created.id }, { status: 201 });
  } catch (error) {
    console.error('Error creating question:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}

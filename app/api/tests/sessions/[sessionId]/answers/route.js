import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';
import { z } from 'zod';

const AnswerSchema = z.object({
  question_id: z.number().int(),
  answer_text: z.string().optional(),
  selected_option_id: z.number().int().optional(),
});

export async function POST(request, { params }) {
  try {
    const { sessionId } = params;
    const body = await request.json();
    const parse = AnswerSchema.safeParse(body);
    if (!parse.success) return NextResponse.json({ error: 'Invalid payload', details: parse.error.flatten() }, { status: 400 });
    const { question_id, answer_text, selected_option_id } = parse.data;

    const existing = await prisma.participantAnswer.findFirst({
      where: { testSessionId: Number(sessionId), questionId: Number(question_id) },
    });

    if (existing) {
      await prisma.participantAnswer.update({
        where: { id: existing.id },
        data: {
          answerValue: answer_text ?? existing.answerValue,
          selectedOptionId: selected_option_id ? Number(selected_option_id) : null,
        },
      });
    } else {
      await prisma.participantAnswer.create({
        data: {
          testSessionId: Number(sessionId),
          questionId: Number(question_id),
          answerValue: answer_text ?? null,
          selectedOptionId: selected_option_id ? Number(selected_option_id) : null,
        },
      });
    }

    return NextResponse.json({ message: 'Jawaban disimpan' });
  } catch (error) {
    console.error('Error saving answer:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}

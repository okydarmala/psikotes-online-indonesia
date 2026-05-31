import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';
import { generateRandomToken } from '../../../../../lib/utils';

export async function GET(request, { params }) {
  try {
    const { assignmentId } = params || {};
    if (!assignmentId || Number.isNaN(Number(assignmentId))) {
      return NextResponse.json({ error: 'assignmentId invalid' }, { status: 400 });
    }
    const assignment = await prisma.testAssignment.findUnique({ where: { id: Number(assignmentId) }, include: { testCategory: true } });
    if (!assignment) return NextResponse.json({ error: 'Penugasan tidak ditemukan' }, { status: 404 });
    return NextResponse.json({ ...assignment, time_limit_minutes: assignment.testCategory?.durationMinutes, categoryName: assignment.testCategory?.name });
  } catch (error) {
    console.error('Error fetching assignment:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const { assignmentId } = params || {};
    if (!assignmentId || Number.isNaN(Number(assignmentId))) {
      return NextResponse.json({ error: 'assignmentId invalid' }, { status: 400 });
    }
    const data = await request.json().catch(() => ({}));
    const { ipAddress } = data;

    const result = await prisma.$transaction(async (tx) => {
      const assignment = await tx.testAssignment.findUnique({ where: { id: Number(assignmentId) } });
      if (!assignment) throw new Error('Penugasan tidak ditemukan');
      if (assignment.status === 'completed') throw new Error('Tes sudah selesai dan tidak dapat diakses kembali');

      const existingSession = await tx.testSession.findFirst({ where: { testAssignmentId: Number(assignmentId), status: 'in_progress' } });
      if (existingSession) return { existing: true, session: existingSession };

      const sessionToken = generateRandomToken();
      const newSession = await tx.testSession.create({
        data: {
          testAssignmentId: Number(assignmentId),
          participantId: assignment.participantId,
          sessionToken,
          status: 'in_progress',
          startedAt: new Date(),
        },
      });

      await tx.testAssignment.update({ where: { id: Number(assignmentId) }, data: { status: 'in_progress', startedAt: new Date() } });

      return { created: true, session: { id: newSession.id, assignmentId: Number(assignmentId), sessionToken, status: newSession.status } };
    });

    if (result.existing) return NextResponse.json({ message: 'Session masih aktif', session: result.session });
    return NextResponse.json({ message: 'Session tes dimulai', session: result.session }, { status: 201 });
  } catch (error) {
    console.error('Error starting test session:', error);
    return NextResponse.json({ error: error.message || 'Terjadi kesalahan server' }, { status: 500 });
  }
}

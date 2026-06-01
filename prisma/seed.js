const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const users = [
    { email: 'admin@psikotes.id', password: 'admin123', name: 'Administrator', role: 'admin' },
    { email: 'recruiter1@company.id', password: 'recruiter123', name: 'Recruiter 1', role: 'recruiter' },
    { email: 'participant1@candidate.id', password: 'participant123', name: 'Participant 1', role: 'participant' },
  ];

  for (const u of users) {
    const hashed = await bcrypt.hash(u.password, 10);
    await prisma.user.upsert({
      where: { email: u.email },
      update: { password: hashed, name: u.name, role: u.role, status: 'active' },
      create: { email: u.email, password: hashed, name: u.name, role: u.role, status: 'active' },
    });
  }

  // Ensure participant record exists for participant user
  const participantUser = await prisma.user.findUnique({ where: { email: 'participant1@candidate.id' } });
  if (participantUser) {
    const existingParticipant = await prisma.participant.findUnique({ where: { userId: participantUser.id } });
    if (!existingParticipant) {
      await prisma.participant.create({ data: { userId: participantUser.id, phone: '081234567890', status: 'active' } });
    }
  }

  // Create default category/subcategory/question
  let cat = await prisma.testCategory.findFirst({ where: { name: 'Default Category' } });
  if (!cat) {
    cat = await prisma.testCategory.create({ data: { name: 'Default Category', description: 'Seeded category', durationMinutes: 30 } });
  }

  let sub = await prisma.testSubcategory.findFirst({ where: { name: 'Default Sub', testCategoryId: cat.id } });
  if (!sub) {
    sub = await prisma.testSubcategory.create({ data: { testCategoryId: cat.id, name: 'Default Sub', questionCount: 1, durationMinutes: 10 } });
  }

  const qExists = await prisma.question.findFirst({ where: { testSubcategoryId: sub.id, displayOrder: 1 } });
  if (!qExists) {
    await prisma.question.create({ data: { testSubcategoryId: sub.id, questionText: 'Contoh pertanyaan 1', questionType: 'single_choice', displayOrder: 1 } });
  }

  // Create a test assignment linking recruiter and participant
  const recruiter = await prisma.user.findUnique({ where: { email: 'recruiter1@company.id' } });
  if (recruiter && participantUser) {
    const participantRecord = await prisma.participant.findUnique({ where: { userId: participantUser.id } });
    if (participantRecord) {
      const existingAssignment = await prisma.testAssignment.findFirst({ where: { recruiterId: recruiter.id, participantId: participantRecord.id, testCategoryId: cat.id } });
      if (!existingAssignment) {
        await prisma.testAssignment.create({ data: { recruiterId: recruiter.id, participantId: participantRecord.id, testCategoryId: cat.id, status: 'pending' } });
      }
    }
  }

  console.log('Seed completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

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

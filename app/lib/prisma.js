import * as PrismaPkg from '@prisma/client';

// Support different module shapes (CJS/ESM interop)
const PrismaClient = PrismaPkg?.PrismaClient || PrismaPkg?.default?.PrismaClient || PrismaPkg?.default || PrismaPkg;

let prisma;

if (!global.prisma) {
  prisma = new PrismaClient();
  global.prisma = prisma;
} else {
  prisma = global.prisma;
}

export default prisma;

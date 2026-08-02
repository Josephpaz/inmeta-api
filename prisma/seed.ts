import { PrismaClient } from '@prisma/client';
import { seedDocumentTypes } from './seeds/document-types.seed';
import { seedEmployees } from './seeds/employees.seed';

const prisma = new PrismaClient();

async function main() {
  await seedEmployees(prisma);
  await seedDocumentTypes(prisma);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());

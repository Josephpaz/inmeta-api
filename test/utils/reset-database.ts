import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function resetDatabase(): Promise<void> {
  await prisma.$executeRawUnsafe(
    'TRUNCATE TABLE "documents", "employee_documents", "document_types", "employees" RESTART IDENTITY CASCADE',
  );
}

export async function disconnectResetClient(): Promise<void> {
  await prisma.$disconnect();
}

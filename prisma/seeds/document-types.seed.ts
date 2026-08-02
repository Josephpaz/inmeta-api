import { randomUUID } from 'node:crypto';
import { PrismaClient } from '@prisma/client';

const DOCUMENT_TYPE_NAMES = [
  'CPF',
  'RG',
  'Certidão de Nascimento',
  'Certidão de Casamento',
  'ASO',
  'Comprovante de Residência',
  'Carteira de Trabalho',
  'Título de Eleitor',
];

export async function seedDocumentTypes(prisma: PrismaClient): Promise<void> {
  for (const name of DOCUMENT_TYPE_NAMES) {
    await prisma.documentType.upsert({
      where: { name },
      update: {},
      create: {
        id: randomUUID(),
        name,
      },
    });
  }

  console.log(`Seeded ${DOCUMENT_TYPE_NAMES.length} document types.`);
}

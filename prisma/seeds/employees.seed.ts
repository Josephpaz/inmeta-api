import { randomUUID } from 'node:crypto';
import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const EMPLOYEES_COUNT = 15;

export async function seedEmployees(prisma: PrismaClient): Promise<void> {
  for (let i = 0; i < EMPLOYEES_COUNT; i++) {
    const name = faker.person.fullName();
    const email = faker.internet.email({ firstName: name.split(' ')[0] });

    await prisma.employee.upsert({
      where: { email },
      update: {},
      create: {
        id: randomUUID(),
        name,
        email,
      },
    });
  }

  console.log(`Seeded ${EMPLOYEES_COUNT} employees.`);
}

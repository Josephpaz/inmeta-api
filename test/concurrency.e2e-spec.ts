import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { createTestApp } from './utils/create-test-app';
import { disconnectResetClient, resetDatabase } from './utils/reset-database';

interface EntityWithId {
  id: string;
}

interface DocumentSubmission {
  version: number;
}

describe('Concurrent document submissions (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    app = await createTestApp();
  });

  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await app.close();
    await disconnectResetClient();
  });

  it('never assigns the same version twice under concurrent submissions', async () => {
    const server = app.getHttpServer();
    const CONCURRENT_SUBMISSIONS = 5;

    const employeeRes = await request(server)
      .post('/employees')
      .send({ name: faker.person.fullName(), email: faker.internet.email() })
      .expect(201);
    const { id: employeeId } = employeeRes.body as EntityWithId;

    const documentTypeRes = await request(server)
      .post('/document-types')
      .send({ name: `E2E-${faker.string.uuid()}` })
      .expect(201);
    const { id: documentTypeId } = documentTypeRes.body as EntityWithId;

    await request(server)
      .post(`/employees/${employeeId}/document-types/${documentTypeId}`)
      .expect(201);

    const submissionPath = `/employees/${employeeId}/document-types/${documentTypeId}/documents`;

    const responses = await Promise.all(
      Array.from({ length: CONCURRENT_SUBMISSIONS }, () =>
        request(server).post(submissionPath),
      ),
    );

    for (const response of responses) {
      expect([201, 409]).toContain(response.status);
    }

    const succeeded = responses.filter((response) => response.status === 201);
    expect(succeeded.length).toBeGreaterThanOrEqual(1);

    const versions = succeeded.map(
      (response) => (response.body as DocumentSubmission).version,
    );
    expect(new Set(versions).size).toBe(versions.length);
  });
});

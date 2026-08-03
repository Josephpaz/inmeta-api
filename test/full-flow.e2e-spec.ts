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

interface PaginatedResult<T> {
  data: T[];
  total: number;
}

interface PendingDocumentItem {
  employeeId: string;
  documentTypeId: string;
}

interface RecentSubmissionItem {
  employeeId: string;
  version: number;
}

describe('Full documentation flow (e2e)', () => {
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

  it('links a document type, tracks it as pending, then clears it on submission', async () => {
    const server = app.getHttpServer();

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

    const pendingBeforeRes = await request(server)
      .get('/documents/pending')
      .query({ employeeId, documentTypeId })
      .expect(200);
    const pendingBefore =
      pendingBeforeRes.body as PaginatedResult<PendingDocumentItem>;
    expect(pendingBefore.total).toBe(1);
    expect(pendingBefore.data).toHaveLength(1);
    expect(pendingBefore.data[0]).toMatchObject({
      employeeId,
      documentTypeId,
    });

    const firstSubmissionRes = await request(server)
      .post(
        `/employees/${employeeId}/document-types/${documentTypeId}/documents`,
      )
      .expect(201);
    expect((firstSubmissionRes.body as DocumentSubmission).version).toBe(1);

    const pendingAfterRes = await request(server)
      .get('/documents/pending')
      .query({ employeeId, documentTypeId })
      .expect(200);
    const pendingAfter =
      pendingAfterRes.body as PaginatedResult<PendingDocumentItem>;
    expect(pendingAfter.total).toBe(0);
    expect(pendingAfter.data).toHaveLength(0);

    const secondSubmissionRes = await request(server)
      .post(
        `/employees/${employeeId}/document-types/${documentTypeId}/documents`,
      )
      .expect(201);
    expect((secondSubmissionRes.body as DocumentSubmission).version).toBe(2);

    const recentSubmissionsRes = await request(server)
      .get('/statistics/recent-submissions')
      .query({ limit: 50 })
      .expect(200);
    const recentSubmissions =
      recentSubmissionsRes.body as RecentSubmissionItem[];
    const submissionsForEmployee = recentSubmissions.filter(
      (item) => item.employeeId === employeeId,
    );
    expect(submissionsForEmployee).toHaveLength(2);
    expect(submissionsForEmployee.map((item) => item.version).sort()).toEqual([
      1, 2,
    ]);
  });

  it('rejects submission when the employee is not linked to the document type', async () => {
    const server = app.getHttpServer();

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
      .post(
        `/employees/${employeeId}/document-types/${documentTypeId}/documents`,
      )
      .expect(404);
  });
});

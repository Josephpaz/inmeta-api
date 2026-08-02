import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { createTestApp } from './utils/create-test-app';
import { disconnectResetClient, resetDatabase } from './utils/reset-database';

interface EntityWithId {
  id: string;
}

interface PaginatedTotal {
  total: number;
}

describe('Soft delete reflected in listings and lookups (e2e)', () => {
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

  it('removes a soft deleted employee from listings and marks it Gone by id', async () => {
    const server = app.getHttpServer();
    const uniqueName = `E2E-Employee-${faker.string.uuid()}`;

    const employeeRes = await request(server)
      .post('/employees')
      .send({ name: uniqueName, email: faker.internet.email() })
      .expect(201);
    const { id: employeeId } = employeeRes.body as EntityWithId;

    const listedBeforeRes = await request(server)
      .get('/employees')
      .query({ name: uniqueName })
      .expect(200);
    expect((listedBeforeRes.body as PaginatedTotal).total).toBe(1);

    await request(server).delete(`/employees/${employeeId}`).expect(204);

    const listedAfterRes = await request(server)
      .get('/employees')
      .query({ name: uniqueName })
      .expect(200);
    expect((listedAfterRes.body as PaginatedTotal).total).toBe(0);

    await request(server).get(`/employees/${employeeId}`).expect(410);

    await request(server).post(`/employees/${employeeId}/restore`).expect(204);

    const listedAfterRestoreRes = await request(server)
      .get('/employees')
      .query({ name: uniqueName })
      .expect(200);
    expect((listedAfterRestoreRes.body as PaginatedTotal).total).toBe(1);
  });

  it('removes a soft deleted document type from listings and marks it Gone by id', async () => {
    const server = app.getHttpServer();
    const uniqueName = `E2E-DocType-${faker.string.uuid()}`;

    const documentTypeRes = await request(server)
      .post('/document-types')
      .send({ name: uniqueName })
      .expect(201);
    const { id: documentTypeId } = documentTypeRes.body as EntityWithId;

    await request(server)
      .delete(`/document-types/${documentTypeId}`)
      .expect(204);

    const listedAfterRes = await request(server)
      .get('/document-types')
      .query({ name: uniqueName })
      .expect(200);
    expect((listedAfterRes.body as PaginatedTotal).total).toBe(0);

    await request(server).get(`/document-types/${documentTypeId}`).expect(410);
  });
});

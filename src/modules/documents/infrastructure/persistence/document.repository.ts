import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { Document } from '../../domain/document.entity';
import { ConcurrentDocumentSubmissionException } from '../../domain/exceptions/concurrent-document-submission.exception';
import {
  IDocumentRepository,
  FindPendingDocumentsParams,
  FindPendingDocumentsResult,
  PendingDocumentItem,
} from '../../domain/document.repository.interface';
import { DocumentMapper } from './document.mapper';

const UNIQUE_CONSTRAINT_VIOLATION = 'P2002';

@Injectable()
export class DocumentRepository implements IDocumentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(document: Document): Promise<Document> {
    try {
      const documentPrisma = await this.prisma.document.create({
        data: {
          id: randomUUID(),
          ...DocumentMapper.toPersistence(document),
        },
      });

      return DocumentMapper.toDomain(documentPrisma);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === UNIQUE_CONSTRAINT_VIOLATION
      ) {
        throw new ConcurrentDocumentSubmissionException();
      }

      throw error;
    }
  }

  async findLatestByEmployeeAndDocumentType(
    employeeId: string,
    documentTypeId: string,
  ): Promise<Document | null> {
    const documentPrisma = await this.prisma.document.findFirst({
      where: { employeeId, documentTypeId },
      orderBy: { version: 'desc' },
    });

    return documentPrisma ? DocumentMapper.toDomain(documentPrisma) : null;
  }

  async findPendingDocuments(
    params: FindPendingDocumentsParams,
  ): Promise<FindPendingDocumentsResult> {
    const skip = (params.page - 1) * params.pageSize;
    const take = params.pageSize;

    const employeeFilter = params.employeeId
      ? Prisma.sql`AND ed."employeeId" = ${params.employeeId}`
      : Prisma.empty;

    const documentTypeFilter = params.documentTypeId
      ? Prisma.sql`AND ed."documentTypeId" = ${params.documentTypeId}`
      : Prisma.empty;

    const whereClause = Prisma.sql`
      WHERE NOT EXISTS (
        SELECT 1 FROM documents d
        WHERE d."employeeId" = ed."employeeId"
          AND d."documentTypeId" = ed."documentTypeId"
      )
      ${employeeFilter}
      ${documentTypeFilter}
    `;

    const data = await this.prisma.$queryRaw<PendingDocumentItem[]>`
      SELECT
        ed."employeeId" AS "employeeId",
        e."name" AS "employeeName",
        ed."documentTypeId" AS "documentTypeId",
        dt."name" AS "documentTypeName",
        ed."createdAt" AS "requiredSince"
      FROM employee_documents ed
      JOIN employees e ON e.id = ed."employeeId" AND e."deletedAt" IS NULL
      JOIN document_types dt ON dt.id = ed."documentTypeId" AND dt."deletedAt" IS NULL
      ${whereClause}
      ORDER BY ed."createdAt" DESC
      LIMIT ${take} OFFSET ${skip}
    `;

    const totalResult = await this.prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*)::bigint AS count
      FROM employee_documents ed
      JOIN employees e ON e.id = ed."employeeId" AND e."deletedAt" IS NULL
      JOIN document_types dt ON dt.id = ed."documentTypeId" AND dt."deletedAt" IS NULL
      ${whereClause}
    `;

    return {
      data,
      total: Number(totalResult[0]?.count ?? 0),
    };
  }
}

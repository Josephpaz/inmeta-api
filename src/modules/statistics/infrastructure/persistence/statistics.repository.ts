import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  IStatisticsRepository,
  MostPendingDocumentType,
  RecentSubmission,
} from '../../domain/statistics.repository.interface';

@Injectable()
export class StatisticsRepository implements IStatisticsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getCompletionPercentage(): Promise<number> {
    const [result] = await this.prisma.$queryRaw<
      { submitted: bigint; total: bigint }[]
    >`
      SELECT
        COUNT(*) FILTER (
          WHERE EXISTS (
            SELECT 1 FROM documents d
            WHERE d."employeeId" = ed."employeeId"
              AND d."documentTypeId" = ed."documentTypeId"
          )
        ) AS submitted,
        COUNT(*) AS total
      FROM employee_documents ed
      JOIN employees e ON e.id = ed."employeeId" AND e."deletedAt" IS NULL
      JOIN document_types dt ON dt.id = ed."documentTypeId" AND dt."deletedAt" IS NULL
    `;

    const total = Number(result?.total ?? 0);
    const submitted = Number(result?.submitted ?? 0);

    return total === 0 ? 0 : (submitted / total) * 100;
  }

  async getMostPendingDocumentTypes(
    limit: number,
  ): Promise<MostPendingDocumentType[]> {
    return this.prisma.$queryRaw<MostPendingDocumentType[]>`
      SELECT
        dt.id AS "documentTypeId",
        dt.name AS "documentTypeName",
        COUNT(*)::int AS "pendingCount"
      FROM employee_documents ed
      JOIN employees e ON e.id = ed."employeeId" AND e."deletedAt" IS NULL
      JOIN document_types dt ON dt.id = ed."documentTypeId" AND dt."deletedAt" IS NULL
      WHERE NOT EXISTS (
        SELECT 1 FROM documents d
        WHERE d."employeeId" = ed."employeeId"
          AND d."documentTypeId" = ed."documentTypeId"
      )
      GROUP BY dt.id, dt.name
      ORDER BY "pendingCount" DESC
      LIMIT ${limit}
    `;
  }

  async getRecentSubmissions(limit: number): Promise<RecentSubmission[]> {
    return this.prisma.$queryRaw<RecentSubmission[]>`
      SELECT
        doc.id AS "documentId",
        doc."employeeId" AS "employeeId",
        e.name AS "employeeName",
        doc."documentTypeId" AS "documentTypeId",
        dt.name AS "documentTypeName",
        doc.version AS "version",
        doc."submittedAt" AS "submittedAt"
      FROM documents doc
      JOIN employees e ON e.id = doc."employeeId" AND e."deletedAt" IS NULL
      JOIN document_types dt ON dt.id = doc."documentTypeId" AND dt."deletedAt" IS NULL
      ORDER BY doc."submittedAt" DESC
      LIMIT ${limit}
    `;
  }
}

import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmployeeDocument } from '../../domain/employee-document.entity';
import { DuplicateEmployeeDocumentException } from '../../domain/exceptions/duplicate-employee-document.exception';
import { IEmployeeDocumentRepository } from '../../domain/employee-document.repository.interface';
import { EmployeeDocumentMapper } from './employee-document.mapper';

const UNIQUE_CONSTRAINT_VIOLATION = 'P2002';

@Injectable()
export class EmployeeDocumentRepository implements IEmployeeDocumentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(employeeDocument: EmployeeDocument): Promise<EmployeeDocument> {
    try {
      const employeeDocumentPrisma = await this.prisma.employeeDocument.create({
        data: {
          id: randomUUID(),
          ...EmployeeDocumentMapper.toPersistence(employeeDocument),
        },
      });

      return EmployeeDocumentMapper.toDomain(employeeDocumentPrisma);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === UNIQUE_CONSTRAINT_VIOLATION
      ) {
        throw new DuplicateEmployeeDocumentException(
          employeeDocument.employeeId,
          employeeDocument.documentTypeId,
        );
      }

      throw error;
    }
  }

  async delete(employeeId: string, documentTypeId: string): Promise<void> {
    await this.prisma.employeeDocument.delete({
      where: {
        employeeId_documentTypeId: { employeeId, documentTypeId },
      },
    });
  }

  async findByEmployeeAndDocumentType(
    employeeId: string,
    documentTypeId: string,
  ): Promise<EmployeeDocument | null> {
    const employeeDocumentPrisma =
      await this.prisma.employeeDocument.findUnique({
        where: {
          employeeId_documentTypeId: { employeeId, documentTypeId },
        },
      });

    return employeeDocumentPrisma
      ? EmployeeDocumentMapper.toDomain(employeeDocumentPrisma)
      : null;
  }
}

import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { DocumentType } from '../../domain/document-type.entity';
import { DuplicateDocumentTypeNameException } from '../../domain/exceptions/duplicate-document-type-name.exception';
import {
  FindManyDocumentTypesParams,
  FindManyDocumentTypesResult,
  IDocumentTypeRepository,
} from '../../domain/document-type.repository.interface';
import { DocumentTypeMapper } from './document-type.mapper';

const UNIQUE_CONSTRAINT_VIOLATION = 'P2002';

@Injectable()
export class DocumentTypeRepository implements IDocumentTypeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(documentType: DocumentType): Promise<DocumentType> {
    try {
      const documentTypePrisma = await this.prisma.documentType.create({
        data: {
          id: randomUUID(),
          ...DocumentTypeMapper.toPersistence(documentType),
        },
      });

      return DocumentTypeMapper.toDomain(documentTypePrisma);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === UNIQUE_CONSTRAINT_VIOLATION
      ) {
        throw new DuplicateDocumentTypeNameException(documentType.name);
      }

      throw error;
    }
  }

  async delete(documentType: DocumentType): Promise<void> {
    await this.prisma.documentType.update({
      where: { id: documentType.id },
      data: { deletedAt: documentType.deletedAt },
    });
  }

  async restore(documentType: DocumentType): Promise<void> {
    await this.prisma.documentType.update({
      where: { id: documentType.id },
      data: { deletedAt: documentType.deletedAt },
    });
  }

  async findById(id: string): Promise<DocumentType | null> {
    const documentTypePrisma = await this.prisma.documentType.findUnique({
      where: { id },
    });

    return documentTypePrisma
      ? DocumentTypeMapper.toDomain(documentTypePrisma)
      : null;
  }

  async findByName(name: string): Promise<DocumentType | null> {
    const documentTypePrisma = await this.prisma.documentType.findUnique({
      where: { name },
    });

    return documentTypePrisma
      ? DocumentTypeMapper.toDomain(documentTypePrisma)
      : null;
  }

  async findMany(
    params: FindManyDocumentTypesParams,
  ): Promise<FindManyDocumentTypesResult> {
    const skip = (params.page - 1) * params.pageSize;
    const take = params.pageSize;

    const where = {
      deletedAt: null,
      ...(params.name && {
        name: { contains: params.name, mode: 'insensitive' as const },
      }),
    };

    const [total, documentTypes] = await this.prisma.$transaction([
      this.prisma.documentType.count({ where }),

      this.prisma.documentType.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      total,
      data: documentTypes.map(DocumentTypeMapper.toDomain),
    };
  }
}

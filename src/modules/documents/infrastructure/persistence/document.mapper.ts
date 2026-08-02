import { Document as PrismaDocument } from '@prisma/client';
import { Document } from '../../domain/document.entity';

export class DocumentMapper {
  static toDomain(raw: PrismaDocument): Document {
    return Document.create(
      {
        employeeId: raw.employeeId,
        documentTypeId: raw.documentTypeId,
        version: raw.version,
      },
      { id: raw.id, createdAt: raw.submittedAt },
    );
  }

  static toPersistence(document: Document) {
    return {
      employeeId: document.employeeId,
      documentTypeId: document.documentTypeId,
      version: document.version,
    };
  }
}

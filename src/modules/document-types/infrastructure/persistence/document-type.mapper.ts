import { DocumentType as PrismaDocumentType } from '@prisma/client';
import { DocumentType } from '../../domain/document-type.entity';

export class DocumentTypeMapper {
  static toDomain(raw: PrismaDocumentType): DocumentType {
    return DocumentType.create(
      { name: raw.name },
      {
        id: raw.id,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        deletedAt: raw.deletedAt,
      },
    );
  }

  static toPersistence(documentType: DocumentType) {
    return {
      name: documentType.name,
      deletedAt: documentType.deletedAt,
    };
  }
}

import { Entity, EntityMetadata } from 'src/shared/core/entity';
import { DocumentTypeAlreadyDeletedException } from './exceptions/document-type-already-deleted.exception';
import { DocumentTypeNotDeletedException } from './exceptions/document-type-not-deleted.exception';
import { InvalidDocumentTypeNameException } from './exceptions/invalid-document-type-name.exception';

interface DocumentTypeProps {
  name: string;
}

export class DocumentType extends Entity<DocumentTypeProps> {
  private constructor(props: DocumentTypeProps, metadata?: EntityMetadata) {
    super(props, metadata);
  }

  static create(
    props: DocumentTypeProps,
    metadata?: EntityMetadata,
  ): DocumentType {
    const documentType = new DocumentType({ name: '' }, metadata);

    documentType.name = props.name;

    return documentType;
  }

  get name(): string {
    return this.props.name;
  }

  set name(value: string) {
    const trimmed = value?.trim();

    if (!trimmed) {
      throw new InvalidDocumentTypeNameException();
    }

    this.props.name = trimmed;
  }

  softDelete(): void {
    if (this.isDeleted) {
      throw new DocumentTypeAlreadyDeletedException();
    }

    this._deletedAt = new Date();
  }

  restore(): void {
    if (!this.isDeleted) {
      throw new DocumentTypeNotDeletedException();
    }

    this._deletedAt = null;
  }
}

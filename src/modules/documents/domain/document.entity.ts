import { Entity, EntityMetadata } from 'src/shared/core/entity';
import { InvalidDocumentException } from './exceptions/invalid-document.exception';

interface DocumentProps {
  employeeId: string;
  documentTypeId: string;
  version: number;
}

export class Document extends Entity<DocumentProps> {
  private constructor(props: DocumentProps, metadata?: EntityMetadata) {
    super(props, metadata);
  }

  static create(props: DocumentProps, metadata?: EntityMetadata): Document {
    if (!props.employeeId?.trim() || !props.documentTypeId?.trim()) {
      throw new InvalidDocumentException(
        'Document must reference a valid employee and document type.',
      );
    }

    if (!Number.isInteger(props.version) || props.version < 1) {
      throw new InvalidDocumentException(
        'Document version must be a positive integer.',
      );
    }

    return new Document(props, metadata);
  }

  get employeeId(): string {
    return this.props.employeeId;
  }

  get documentTypeId(): string {
    return this.props.documentTypeId;
  }

  get version(): number {
    return this.props.version;
  }
}

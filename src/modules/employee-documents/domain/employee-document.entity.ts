import { Entity, EntityMetadata } from 'src/shared/core/entity';
import { InvalidEmployeeDocumentException } from './exceptions/invalid-employee-document.exception';

interface EmployeeDocumentProps {
  employeeId: string;
  documentTypeId: string;
}

export class EmployeeDocument extends Entity<EmployeeDocumentProps> {
  private constructor(props: EmployeeDocumentProps, metadata?: EntityMetadata) {
    super(props, metadata);
  }

  static create(
    props: EmployeeDocumentProps,
    metadata?: EntityMetadata,
  ): EmployeeDocument {
    if (!props.employeeId?.trim() || !props.documentTypeId?.trim()) {
      throw new InvalidEmployeeDocumentException();
    }

    return new EmployeeDocument(props, metadata);
  }

  get employeeId(): string {
    return this.props.employeeId;
  }

  get documentTypeId(): string {
    return this.props.documentTypeId;
  }
}

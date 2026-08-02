import { HttpStatus } from '@nestjs/common';
import { DomainException } from 'src/shared/core/domain-exception';

export class DuplicateEmployeeDocumentException extends DomainException {
  constructor(employeeId: string, documentTypeId: string) {
    super(
      `Employee "${employeeId}" is already linked to document type "${documentTypeId}".`,
      HttpStatus.CONFLICT,
    );
    this.name = 'DuplicateEmployeeDocumentException';
  }
}

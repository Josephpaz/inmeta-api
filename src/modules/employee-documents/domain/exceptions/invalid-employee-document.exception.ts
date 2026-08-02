import { HttpStatus } from '@nestjs/common';
import { DomainException } from 'src/shared/core/domain-exception';

export class InvalidEmployeeDocumentException extends DomainException {
  constructor() {
    super(
      'Employee document must reference a valid employee and document type.',
      HttpStatus.BAD_REQUEST,
    );
    this.name = 'InvalidEmployeeDocumentException';
  }
}

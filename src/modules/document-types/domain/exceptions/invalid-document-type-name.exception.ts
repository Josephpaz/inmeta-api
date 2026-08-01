import { HttpStatus } from '@nestjs/common';
import { DomainException } from 'src/shared/core/domain-exception';

export class InvalidDocumentTypeNameException extends DomainException {
  constructor() {
    super('Document type name must not be empty.', HttpStatus.BAD_REQUEST);
    this.name = 'InvalidDocumentTypeNameException';
  }
}

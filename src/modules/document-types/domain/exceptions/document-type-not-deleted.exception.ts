import { HttpStatus } from '@nestjs/common';
import { DomainException } from 'src/shared/core/domain-exception';

export class DocumentTypeNotDeletedException extends DomainException {
  constructor() {
    super('Document type is not deleted.', HttpStatus.CONFLICT);
    this.name = 'DocumentTypeNotDeletedException';
  }
}

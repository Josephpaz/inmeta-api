import { HttpStatus } from '@nestjs/common';
import { DomainException } from 'src/shared/core/domain-exception';

export class DocumentTypeAlreadyDeletedException extends DomainException {
  constructor() {
    super('Document type is already deleted.', HttpStatus.CONFLICT);
    this.name = 'DocumentTypeAlreadyDeletedException';
  }
}

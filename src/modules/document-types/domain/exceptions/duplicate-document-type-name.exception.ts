import { HttpStatus } from '@nestjs/common';
import { DomainException } from 'src/shared/core/domain-exception';

export class DuplicateDocumentTypeNameException extends DomainException {
  constructor(name: string) {
    super(
      `A document type with name "${name}" already exists.`,
      HttpStatus.CONFLICT,
    );
    this.name = 'DuplicateDocumentTypeNameException';
  }
}

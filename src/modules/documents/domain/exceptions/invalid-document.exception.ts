import { HttpStatus } from '@nestjs/common';
import { DomainException } from 'src/shared/core/domain-exception';

export class InvalidDocumentException extends DomainException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
    this.name = 'InvalidDocumentException';
  }
}

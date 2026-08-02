import { HttpStatus } from '@nestjs/common';
import { DomainException } from 'src/shared/core/domain-exception';

export class ConcurrentDocumentSubmissionException extends DomainException {
  constructor() {
    super(
      'Another submission for this employee and document type was processed at the same time. Please try again.',
      HttpStatus.CONFLICT,
    );
    this.name = 'ConcurrentDocumentSubmissionException';
  }
}

import { HttpStatus } from '@nestjs/common';
import { DomainException } from 'src/shared/core/domain-exception';

export class DuplicateEmailException extends DomainException {
  constructor(email: string) {
    super(
      `An employee with email "${email}" already exists.`,
      HttpStatus.CONFLICT,
    );
    this.name = 'DuplicateEmailException';
  }
}

import { HttpStatus } from '@nestjs/common';
import { DomainException } from 'src/shared/core/domain-exception';

export class InvalidEmployeeEmailException extends DomainException {
  constructor() {
    super(
      'Employee email must be a valid email address.',
      HttpStatus.BAD_REQUEST,
    );
    this.name = 'InvalidEmployeeEmailException';
  }
}

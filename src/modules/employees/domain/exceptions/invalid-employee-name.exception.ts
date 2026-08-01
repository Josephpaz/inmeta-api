import { HttpStatus } from '@nestjs/common';
import { DomainException } from 'src/shared/core/domain-exception';

export class InvalidEmployeeNameException extends DomainException {
  constructor() {
    super('Employee name must not be empty.', HttpStatus.BAD_REQUEST);
    this.name = 'InvalidEmployeeNameException';
  }
}

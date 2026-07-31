import { HttpStatus } from '@nestjs/common';
import { DomainException } from 'src/shared/core/domain-exception';

export class EmployeeAlreadyDeletedException extends DomainException {
  constructor() {
    super('Employee is already deleted.', HttpStatus.CONFLICT);
    this.name = 'EmployeeAlreadyDeletedException';
  }
}

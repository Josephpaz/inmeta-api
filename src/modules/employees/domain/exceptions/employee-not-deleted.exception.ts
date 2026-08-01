import { HttpStatus } from '@nestjs/common';
import { DomainException } from 'src/shared/core/domain-exception';

export class EmployeeNotDeletedException extends DomainException {
  constructor() {
    super('Employee is not deleted.', HttpStatus.CONFLICT);
    this.name = 'EmployeeNotDeletedException';
  }
}

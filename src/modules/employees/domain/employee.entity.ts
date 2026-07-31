import { Entity, EntityMetadata } from 'src/shared/core/entity';
import { EmployeeAlreadyDeletedException } from './exceptions/employee-already-deleted.exception';
import { InvalidEmployeeEmailException } from './exceptions/invalid-employee-email.exception';
import { InvalidEmployeeNameException } from './exceptions/invalid-employee-name.exception';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface EmployeeProps {
  name: string;
  email: string;
}

export class Employee extends Entity<EmployeeProps> {
  private constructor(props: EmployeeProps, metadata?: EntityMetadata) {
    super(props, metadata);
  }

  static create(props: EmployeeProps, metadata?: EntityMetadata): Employee {
    const employee = new Employee({ name: '', email: '' }, metadata);

    employee.name = props.name;
    employee.email = props.email;

    return employee;
  }

  get name(): string {
    return this.props.name;
  }

  set name(value: string) {
    const trimmed = value?.trim();

    if (!trimmed) {
      throw new InvalidEmployeeNameException();
    }

    this.props.name = trimmed;
  }

  get email(): string {
    return this.props.email;
  }

  set email(value: string) {
    const normalized = value?.trim().toLowerCase();

    if (!normalized || !EMAIL_REGEX.test(normalized)) {
      throw new InvalidEmployeeEmailException();
    }

    this.props.email = normalized;
  }

  softDelete(): void {
    if (this.isDeleted) {
      throw new EmployeeAlreadyDeletedException();
    }

    this._deletedAt = new Date();
  }
}

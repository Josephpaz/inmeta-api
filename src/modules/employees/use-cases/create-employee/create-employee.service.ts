import { Injectable } from '@nestjs/common';
import { Employee } from '../../domain/employee.entity';
import { DuplicateEmailException } from '../../domain/exceptions/duplicate-email.exception';
import { EmployeeRepository } from '../../domain/employee.repository.interface';

interface CreateEmployeeInput {
  name: string;
  email: string;
}

@Injectable()
export class CreateEmployeeService {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  async execute(input: CreateEmployeeInput): Promise<Employee> {
    const existing = await this.employeeRepository.findByEmail(input.email);

    if (existing) {
      throw new DuplicateEmailException(input.email);
    }

    const employee = Employee.create({
      name: input.name,
      email: input.email,
    });

    return this.employeeRepository.create(employee);
  }
}

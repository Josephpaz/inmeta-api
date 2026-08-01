import { Injectable, NotFoundException } from '@nestjs/common';
import { Employee } from '../../domain/employee.entity';
import { IEmployeeRepository } from '../../domain/employee.repository.interface';

@Injectable()
export class GetEmployeeService {
  constructor(private readonly employeeRepository: IEmployeeRepository) {}

  async execute(id: string): Promise<Employee> {
    const employee = await this.employeeRepository.findById(id);

    if (!employee || employee.isDeleted) {
      throw new NotFoundException(`Employee with id "${id}" not found.`);
    }

    return employee;
  }
}

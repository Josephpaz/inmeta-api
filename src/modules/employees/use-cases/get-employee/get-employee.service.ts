import { GoneException, Injectable, NotFoundException } from '@nestjs/common';
import { Employee } from '../../domain/employee.entity';
import { IEmployeeRepository } from '../../domain/employee.repository.interface';

@Injectable()
export class GetEmployeeService {
  constructor(private readonly employeeRepository: IEmployeeRepository) {}

  async execute(id: string): Promise<Employee> {
    const employee = await this.employeeRepository.findById(id);

    if (!employee) {
      throw new NotFoundException(`Employee with id "${id}" not found.`);
    }

    if (employee.isDeleted) {
      throw new GoneException(`Employee with id "${id}" was removed.`);
    }

    return employee;
  }
}

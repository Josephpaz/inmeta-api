import { Injectable, NotFoundException } from '@nestjs/common';
import { IEmployeeRepository } from '../../domain/employee.repository.interface';

@Injectable()
export class DeleteEmployeeService {
  constructor(private readonly employeeRepository: IEmployeeRepository) {}

  async execute(id: string): Promise<void> {
    const employee = await this.employeeRepository.findById(id);

    if (!employee) {
      throw new NotFoundException(`Employee with id "${id}" not found.`);
    }

    employee.softDelete();

    await this.employeeRepository.delete(employee);
  }
}

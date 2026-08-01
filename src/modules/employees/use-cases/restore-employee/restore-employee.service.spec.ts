import { NotFoundException } from '@nestjs/common';
import { Employee } from '../../domain/employee.entity';
import { EmployeeNotDeletedException } from '../../domain/exceptions/employee-not-deleted.exception';
import { IEmployeeRepository } from '../../domain/employee.repository.interface';
import { RestoreEmployeeService } from './restore-employee.service';

describe('RestoreEmployeeService', () => {
  let service: RestoreEmployeeService;
  let employeeRepository: jest.Mocked<IEmployeeRepository>;

  beforeEach(() => {
    employeeRepository = {
      create: jest.fn(),
      delete: jest.fn(),
      restore: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findMany: jest.fn(),
    };

    service = new RestoreEmployeeService(employeeRepository);
  });

  it('restores an employee that is deleted', async () => {
    const employee = Employee.create(
      { name: 'Jane Doe', email: 'jane.doe@example.com' },
      {
        id: 'id-1',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      },
    );
    employeeRepository.findById.mockResolvedValue(employee);

    await service.execute('id-1');

    expect(employee.isDeleted).toBe(false);
    expect(employeeRepository.restore).toHaveBeenCalledWith(employee);
  });

  it('throws NotFoundException when the employee does not exist', async () => {
    employeeRepository.findById.mockResolvedValue(null);

    await expect(service.execute('missing-id')).rejects.toThrow(
      NotFoundException,
    );

    expect(employeeRepository.restore).not.toHaveBeenCalled();
  });

  it('throws EmployeeNotDeletedException when the employee is not deleted', async () => {
    const employee = Employee.create({
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
    });
    employeeRepository.findById.mockResolvedValue(employee);

    await expect(service.execute(employee.id as string)).rejects.toThrow(
      EmployeeNotDeletedException,
    );

    expect(employeeRepository.restore).not.toHaveBeenCalled();
  });
});

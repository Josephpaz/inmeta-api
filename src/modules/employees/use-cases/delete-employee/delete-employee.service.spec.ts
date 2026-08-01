import { NotFoundException } from '@nestjs/common';
import { Employee } from '../../domain/employee.entity';
import { EmployeeAlreadyDeletedException } from '../../domain/exceptions/employee-already-deleted.exception';
import { IEmployeeRepository } from '../../domain/employee.repository.interface';
import { DeleteEmployeeService } from './delete-employee.service';

describe('DeleteEmployeeService', () => {
  let service: DeleteEmployeeService;
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

    service = new DeleteEmployeeService(employeeRepository);
  });

  it('soft deletes an employee that exists and is not deleted', async () => {
    const employee = Employee.create({
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
    });
    employeeRepository.findById.mockResolvedValue(employee);

    await service.execute(employee.id as string);

    expect(employee.isDeleted).toBe(true);
    expect(employeeRepository.delete).toHaveBeenCalledWith(employee);
  });

  it('throws NotFoundException when the employee does not exist', async () => {
    employeeRepository.findById.mockResolvedValue(null);

    await expect(service.execute('missing-id')).rejects.toThrow(
      NotFoundException,
    );

    expect(employeeRepository.delete).not.toHaveBeenCalled();
  });

  it('throws EmployeeAlreadyDeletedException when the employee is already deleted', async () => {
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

    await expect(service.execute('id-1')).rejects.toThrow(
      EmployeeAlreadyDeletedException,
    );

    expect(employeeRepository.delete).not.toHaveBeenCalled();
  });
});

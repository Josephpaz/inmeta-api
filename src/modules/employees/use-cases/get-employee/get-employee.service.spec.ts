import { GoneException, NotFoundException } from '@nestjs/common';
import { Employee } from '../../domain/employee.entity';
import { IEmployeeRepository } from '../../domain/employee.repository.interface';
import { GetEmployeeService } from './get-employee.service';

describe('GetEmployeeService', () => {
  let service: GetEmployeeService;
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

    service = new GetEmployeeService(employeeRepository);
  });

  it('returns the employee when it exists and is not deleted', async () => {
    const employee = Employee.create({
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
    });
    employeeRepository.findById.mockResolvedValue(employee);

    const result = await service.execute(employee.id as string);

    expect(result).toBe(employee);
  });

  it('throws NotFoundException when the employee does not exist', async () => {
    employeeRepository.findById.mockResolvedValue(null);

    await expect(service.execute('missing-id')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws GoneException when the employee is deleted', async () => {
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

    await expect(service.execute('id-1')).rejects.toThrow(GoneException);
  });
});

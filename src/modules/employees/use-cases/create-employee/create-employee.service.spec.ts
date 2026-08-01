import { Employee } from '../../domain/employee.entity';
import { DuplicateEmailException } from '../../domain/exceptions/duplicate-email.exception';
import { IEmployeeRepository } from '../../domain/employee.repository.interface';
import { CreateEmployeeService } from './create-employee.service';

describe('CreateEmployeeService', () => {
  let service: CreateEmployeeService;
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

    service = new CreateEmployeeService(employeeRepository);
  });

  it('creates an employee when the email is not in use', async () => {
    employeeRepository.findByEmail.mockResolvedValue(null);
    employeeRepository.create.mockImplementation((employee) =>
      Promise.resolve(employee),
    );

    const employee = await service.execute({
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
    });

    expect(employee).toBeInstanceOf(Employee);
    expect(employee.name).toBe('Jane Doe');
    expect(employee.email).toBe('jane.doe@example.com');
    expect(employeeRepository.create).toHaveBeenCalledTimes(1);
  });

  it('throws DuplicateEmailException when the email is already in use', async () => {
    const existing = Employee.create({
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
    });
    employeeRepository.findByEmail.mockResolvedValue(existing);

    await expect(
      service.execute({ name: 'Jane Doe', email: 'jane.doe@example.com' }),
    ).rejects.toThrow(DuplicateEmailException);

    expect(employeeRepository.create).not.toHaveBeenCalled();
  });
});

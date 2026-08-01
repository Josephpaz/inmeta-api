import { Employee } from '../../domain/employee.entity';
import { IEmployeeRepository } from '../../domain/employee.repository.interface';
import { GetEmployeesService } from './get-employees.service';

describe('GetEmployeesService', () => {
  let service: GetEmployeesService;
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

    service = new GetEmployeesService(employeeRepository);
  });

  it('returns the paginated result from the repository', async () => {
    const employee = Employee.create({
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
    });
    const repositoryResult = { data: [employee], total: 1 };
    employeeRepository.findMany.mockResolvedValue(repositoryResult);

    const input = { page: 1, pageSize: 10, name: 'Jane' };
    const result = await service.execute(input);

    expect(employeeRepository.findMany).toHaveBeenCalledWith(input);
    expect(result).toBe(repositoryResult);
  });
});

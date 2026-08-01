import { Employee } from './employee.entity';

export interface FindManyEmployeesParams {
  page: number;
  pageSize: number;
  name?: string;
  email?: string;
}

export interface FindManyEmployeesResult {
  data: Employee[];
  total: number;
}

export abstract class IEmployeeRepository {
  abstract create(employee: Employee): Promise<Employee>;
  abstract delete(employee: Employee): Promise<void>;
  abstract findById(id: string): Promise<Employee | null>;
  abstract findByEmail(email: string): Promise<Employee | null>;
  abstract findMany(
    params: FindManyEmployeesParams,
  ): Promise<FindManyEmployeesResult>;
}

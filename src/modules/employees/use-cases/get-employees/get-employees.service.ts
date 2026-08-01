import { Injectable } from '@nestjs/common';
import {
  IEmployeeRepository,
  FindManyEmployeesResult,
} from '../../domain/employee.repository.interface';

interface GetEmployeesInput {
  page: number;
  pageSize: number;
  name?: string;
  email?: string;
}

@Injectable()
export class GetEmployeesService {
  constructor(private readonly employeeRepository: IEmployeeRepository) {}

  async execute(input: GetEmployeesInput): Promise<FindManyEmployeesResult> {
    return this.employeeRepository.findMany(input);
  }
}

import { Module } from '@nestjs/common';
import { IEmployeeRepository } from './domain/employee.repository.interface';
import { EmployeeRepository } from './infrastructure/persistence/employee.repository';
import { CreateEmployeeController } from './use-cases/create-employee/create-employee.controller';
import { CreateEmployeeService } from './use-cases/create-employee/create-employee.service';
import { GetEmployeeController } from './use-cases/get-employee/get-employee.controller';
import { GetEmployeeService } from './use-cases/get-employee/get-employee.service';
import { GetEmployeesController } from './use-cases/get-employees/get-employees.controller';
import { GetEmployeesService } from './use-cases/get-employees/get-employees.service';

@Module({
  controllers: [
    CreateEmployeeController,
    GetEmployeesController,
    GetEmployeeController,
  ],
  providers: [
    CreateEmployeeService,
    GetEmployeesService,
    GetEmployeeService,
    {
      provide: IEmployeeRepository,
      useClass: EmployeeRepository,
    },
  ],
  exports: [IEmployeeRepository],
})
export class EmployeesModule {}

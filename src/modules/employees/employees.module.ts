import { Module } from '@nestjs/common';
import { IEmployeeRepository } from './domain/employee.repository.interface';
import { EmployeeRepository } from './infrastructure/persistence/employee.repository';
import { CreateEmployeeController } from './use-cases/create-employee/create-employee.controller';
import { CreateEmployeeService } from './use-cases/create-employee/create-employee.service';
import { DeleteEmployeeController } from './use-cases/delete-employee/delete-employee.controller';
import { DeleteEmployeeService } from './use-cases/delete-employee/delete-employee.service';
import { GetEmployeeController } from './use-cases/get-employee/get-employee.controller';
import { GetEmployeeService } from './use-cases/get-employee/get-employee.service';
import { GetEmployeesController } from './use-cases/get-employees/get-employees.controller';
import { GetEmployeesService } from './use-cases/get-employees/get-employees.service';
import { RestoreEmployeeController } from './use-cases/restore-employee/restore-employee.controller';
import { RestoreEmployeeService } from './use-cases/restore-employee/restore-employee.service';

@Module({
  controllers: [
    CreateEmployeeController,
    GetEmployeesController,
    GetEmployeeController,
    DeleteEmployeeController,
    RestoreEmployeeController,
  ],
  providers: [
    CreateEmployeeService,
    GetEmployeesService,
    GetEmployeeService,
    DeleteEmployeeService,
    RestoreEmployeeService,
    {
      provide: IEmployeeRepository,
      useClass: EmployeeRepository,
    },
  ],
  exports: [IEmployeeRepository],
})
export class EmployeesModule {}

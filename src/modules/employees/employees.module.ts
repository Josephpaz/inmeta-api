import { Module } from '@nestjs/common';
import { EmployeeRepository } from './domain/employee.repository.interface';
import { PrismaEmployeeRepository } from './infrastructure/persistence/employee.repository';
import { CreateEmployeeController } from './use-cases/create-employee/create-employee.controller';
import { CreateEmployeeService } from './use-cases/create-employee/create-employee.service';

@Module({
  controllers: [CreateEmployeeController],
  providers: [
    CreateEmployeeService,
    {
      provide: EmployeeRepository,
      useClass: PrismaEmployeeRepository,
    },
  ],
  exports: [EmployeeRepository],
})
export class EmployeesModule {}

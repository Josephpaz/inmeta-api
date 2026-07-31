import { Module } from '@nestjs/common';
import { EmployeeRepository } from './domain/employee.repository.interface';
import { PrismaEmployeeRepository } from './infrastructure/persistence/employee.repository';

@Module({
  providers: [
    {
      provide: EmployeeRepository,
      useClass: PrismaEmployeeRepository,
    },
  ],
  exports: [EmployeeRepository],
})
export class EmployeesModule {}

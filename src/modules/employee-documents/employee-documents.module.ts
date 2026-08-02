import { Module } from '@nestjs/common';
import { DocumentTypesModule } from '../document-types/document-types.module';
import { EmployeesModule } from '../employees/employees.module';
import { IEmployeeDocumentRepository } from './domain/employee-document.repository.interface';
import { EmployeeDocumentRepository } from './infrastructure/persistence/employee-document.repository';

@Module({
  imports: [EmployeesModule, DocumentTypesModule],
  providers: [
    {
      provide: IEmployeeDocumentRepository,
      useClass: EmployeeDocumentRepository,
    },
  ],
  exports: [IEmployeeDocumentRepository],
})
export class EmployeeDocumentsModule {}

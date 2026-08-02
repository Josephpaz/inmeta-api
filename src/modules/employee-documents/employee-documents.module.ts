import { Module } from '@nestjs/common';
import { DocumentTypesModule } from '../document-types/document-types.module';
import { EmployeesModule } from '../employees/employees.module';
import { IEmployeeDocumentRepository } from './domain/employee-document.repository.interface';
import { EmployeeDocumentRepository } from './infrastructure/persistence/employee-document.repository';
import { CreateEmployeeDocumentController } from './use-cases/create-employee-document/create-employee-document.controller';
import { CreateEmployeeDocumentService } from './use-cases/create-employee-document/create-employee-document.service';
import { DeleteEmployeeDocumentController } from './use-cases/delete-employee-document/delete-employee-document.controller';
import { DeleteEmployeeDocumentService } from './use-cases/delete-employee-document/delete-employee-document.service';

@Module({
  imports: [EmployeesModule, DocumentTypesModule],
  controllers: [
    CreateEmployeeDocumentController,
    DeleteEmployeeDocumentController,
  ],
  providers: [
    CreateEmployeeDocumentService,
    DeleteEmployeeDocumentService,
    {
      provide: IEmployeeDocumentRepository,
      useClass: EmployeeDocumentRepository,
    },
  ],
  exports: [IEmployeeDocumentRepository],
})
export class EmployeeDocumentsModule {}

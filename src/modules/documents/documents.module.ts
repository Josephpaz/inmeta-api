import { Module } from '@nestjs/common';
import { DocumentTypesModule } from '../document-types/document-types.module';
import { EmployeeDocumentsModule } from '../employee-documents/employee-documents.module';
import { EmployeesModule } from '../employees/employees.module';
import { IDocumentRepository } from './domain/document.repository.interface';
import { DocumentRepository } from './infrastructure/persistence/document.repository';
import { GetPendingDocumentsController } from './use-cases/get-pending-documents/get-pending-documents.controller';
import { GetPendingDocumentsService } from './use-cases/get-pending-documents/get-pending-documents.service';
import { SubmitDocumentController } from './use-cases/submit-document/submit-document.controller';
import { SubmitDocumentService } from './use-cases/submit-document/submit-document.service';

@Module({
  imports: [EmployeesModule, DocumentTypesModule, EmployeeDocumentsModule],
  controllers: [SubmitDocumentController, GetPendingDocumentsController],
  providers: [
    SubmitDocumentService,
    GetPendingDocumentsService,
    {
      provide: IDocumentRepository,
      useClass: DocumentRepository,
    },
  ],
  exports: [IDocumentRepository],
})
export class DocumentsModule {}

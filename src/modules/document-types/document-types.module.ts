import { Module } from '@nestjs/common';
import { IDocumentTypeRepository } from './domain/document-type.repository.interface';
import { DocumentTypeRepository } from './infrastructure/persistence/document-type.repository';
import { CreateDocumentTypeController } from './use-cases/create-document-type/create-document-type.controller';
import { CreateDocumentTypeService } from './use-cases/create-document-type/create-document-type.service';
import { DeleteDocumentTypeController } from './use-cases/delete-document-type/delete-document-type.controller';
import { DeleteDocumentTypeService } from './use-cases/delete-document-type/delete-document-type.service';
import { GetDocumentTypeController } from './use-cases/get-document-type/get-document-type.controller';
import { GetDocumentTypeService } from './use-cases/get-document-type/get-document-type.service';
import { GetDocumentTypesController } from './use-cases/get-document-types/get-document-types.controller';
import { GetDocumentTypesService } from './use-cases/get-document-types/get-document-types.service';
import { RestoreDocumentTypeController } from './use-cases/restore-document-type/restore-document-type.controller';
import { RestoreDocumentTypeService } from './use-cases/restore-document-type/restore-document-type.service';

@Module({
  controllers: [
    CreateDocumentTypeController,
    GetDocumentTypesController,
    GetDocumentTypeController,
    DeleteDocumentTypeController,
    RestoreDocumentTypeController,
  ],
  providers: [
    CreateDocumentTypeService,
    GetDocumentTypesService,
    GetDocumentTypeService,
    DeleteDocumentTypeService,
    RestoreDocumentTypeService,
    {
      provide: IDocumentTypeRepository,
      useClass: DocumentTypeRepository,
    },
  ],
  exports: [IDocumentTypeRepository],
})
export class DocumentTypesModule {}

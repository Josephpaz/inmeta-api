import { Module } from '@nestjs/common';
import { IDocumentTypeRepository } from './domain/document-type.repository.interface';
import { DocumentTypeRepository } from './infrastructure/persistence/document-type.repository';
import { CreateDocumentTypeController } from './use-cases/create-document-type/create-document-type.controller';
import { CreateDocumentTypeService } from './use-cases/create-document-type/create-document-type.service';
import { GetDocumentTypesController } from './use-cases/get-document-types/get-document-types.controller';
import { GetDocumentTypesService } from './use-cases/get-document-types/get-document-types.service';

@Module({
  controllers: [CreateDocumentTypeController, GetDocumentTypesController],
  providers: [
    CreateDocumentTypeService,
    GetDocumentTypesService,
    {
      provide: IDocumentTypeRepository,
      useClass: DocumentTypeRepository,
    },
  ],
  exports: [IDocumentTypeRepository],
})
export class DocumentTypesModule {}

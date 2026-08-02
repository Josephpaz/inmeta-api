import { Module } from '@nestjs/common';
import { IDocumentTypeRepository } from './domain/document-type.repository.interface';
import { DocumentTypeRepository } from './infrastructure/persistence/document-type.repository';
import { CreateDocumentTypeController } from './use-cases/create-document-type/create-document-type.controller';
import { CreateDocumentTypeService } from './use-cases/create-document-type/create-document-type.service';

@Module({
  controllers: [CreateDocumentTypeController],
  providers: [
    CreateDocumentTypeService,
    {
      provide: IDocumentTypeRepository,
      useClass: DocumentTypeRepository,
    },
  ],
  exports: [IDocumentTypeRepository],
})
export class DocumentTypesModule {}

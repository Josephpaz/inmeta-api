import { Module } from '@nestjs/common';
import { IDocumentTypeRepository } from './domain/document-type.repository.interface';
import { DocumentTypeRepository } from './infrastructure/persistence/document-type.repository';

@Module({
  providers: [
    {
      provide: IDocumentTypeRepository,
      useClass: DocumentTypeRepository,
    },
  ],
  exports: [IDocumentTypeRepository],
})
export class DocumentTypesModule {}

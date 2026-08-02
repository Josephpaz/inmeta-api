import { Injectable } from '@nestjs/common';
import { DocumentType } from '../../domain/document-type.entity';
import { DuplicateDocumentTypeNameException } from '../../domain/exceptions/duplicate-document-type-name.exception';
import { IDocumentTypeRepository } from '../../domain/document-type.repository.interface';

interface CreateDocumentTypeInput {
  name: string;
}

@Injectable()
export class CreateDocumentTypeService {
  constructor(
    private readonly documentTypeRepository: IDocumentTypeRepository,
  ) {}

  async execute(input: CreateDocumentTypeInput): Promise<DocumentType> {
    const existing = await this.documentTypeRepository.findByName(input.name);

    if (existing) {
      throw new DuplicateDocumentTypeNameException(input.name);
    }

    let documentType = DocumentType.create({ name: input.name });

    documentType = await this.documentTypeRepository.create(documentType);

    return documentType;
  }
}

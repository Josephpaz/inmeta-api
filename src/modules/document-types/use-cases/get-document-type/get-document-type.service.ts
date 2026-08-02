import { GoneException, Injectable, NotFoundException } from '@nestjs/common';
import { DocumentType } from '../../domain/document-type.entity';
import { IDocumentTypeRepository } from '../../domain/document-type.repository.interface';

@Injectable()
export class GetDocumentTypeService {
  constructor(
    private readonly documentTypeRepository: IDocumentTypeRepository,
  ) {}

  async execute(id: string): Promise<DocumentType> {
    const documentType = await this.documentTypeRepository.findById(id);

    if (!documentType) {
      throw new NotFoundException(`Document type with id "${id}" not found.`);
    }

    if (documentType.isDeleted) {
      throw new GoneException(`Document type with id "${id}" was removed.`);
    }

    return documentType;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { IDocumentTypeRepository } from '../../domain/document-type.repository.interface';

@Injectable()
export class RestoreDocumentTypeService {
  constructor(
    private readonly documentTypeRepository: IDocumentTypeRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const documentType = await this.documentTypeRepository.findById(id);

    if (!documentType) {
      throw new NotFoundException(`Document type with id "${id}" not found.`);
    }

    documentType.restore();

    await this.documentTypeRepository.restore(documentType);
  }
}

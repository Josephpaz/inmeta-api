import { GoneException, NotFoundException } from '@nestjs/common';
import { DocumentType } from '../../domain/document-type.entity';
import { IDocumentTypeRepository } from '../../domain/document-type.repository.interface';
import { GetDocumentTypeService } from './get-document-type.service';

describe('GetDocumentTypeService', () => {
  let service: GetDocumentTypeService;
  let documentTypeRepository: jest.Mocked<IDocumentTypeRepository>;

  beforeEach(() => {
    documentTypeRepository = {
      create: jest.fn(),
      delete: jest.fn(),
      restore: jest.fn(),
      findById: jest.fn(),
      findByName: jest.fn(),
      findMany: jest.fn(),
    };

    service = new GetDocumentTypeService(documentTypeRepository);
  });

  it('returns the document type when it exists and is not deleted', async () => {
    const documentType = DocumentType.create({ name: 'CPF' });
    documentTypeRepository.findById.mockResolvedValue(documentType);

    const result = await service.execute(documentType.id as string);

    expect(result).toBe(documentType);
  });

  it('throws NotFoundException when the document type does not exist', async () => {
    documentTypeRepository.findById.mockResolvedValue(null);

    await expect(service.execute('missing-id')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws GoneException when the document type is deleted', async () => {
    const documentType = DocumentType.create(
      { name: 'CPF' },
      {
        id: 'id-1',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      },
    );
    documentTypeRepository.findById.mockResolvedValue(documentType);

    await expect(service.execute('id-1')).rejects.toThrow(GoneException);
  });
});

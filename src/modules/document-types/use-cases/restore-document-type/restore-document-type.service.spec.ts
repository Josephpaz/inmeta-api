import { NotFoundException } from '@nestjs/common';
import { DocumentType } from '../../domain/document-type.entity';
import { DocumentTypeNotDeletedException } from '../../domain/exceptions/document-type-not-deleted.exception';
import { IDocumentTypeRepository } from '../../domain/document-type.repository.interface';
import { RestoreDocumentTypeService } from './restore-document-type.service';

describe('RestoreDocumentTypeService', () => {
  let service: RestoreDocumentTypeService;
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

    service = new RestoreDocumentTypeService(documentTypeRepository);
  });

  it('restores a document type that is deleted', async () => {
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

    await service.execute('id-1');

    expect(documentType.isDeleted).toBe(false);
    expect(documentTypeRepository.restore).toHaveBeenCalledWith(documentType);
  });

  it('throws NotFoundException when the document type does not exist', async () => {
    documentTypeRepository.findById.mockResolvedValue(null);

    await expect(service.execute('missing-id')).rejects.toThrow(
      NotFoundException,
    );

    expect(documentTypeRepository.restore).not.toHaveBeenCalled();
  });

  it('throws DocumentTypeNotDeletedException when the document type is not deleted', async () => {
    const documentType = DocumentType.create({ name: 'CPF' });
    documentTypeRepository.findById.mockResolvedValue(documentType);

    await expect(service.execute(documentType.id as string)).rejects.toThrow(
      DocumentTypeNotDeletedException,
    );

    expect(documentTypeRepository.restore).not.toHaveBeenCalled();
  });
});

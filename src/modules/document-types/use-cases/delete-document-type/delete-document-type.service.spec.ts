import { NotFoundException } from '@nestjs/common';
import { DocumentType } from '../../domain/document-type.entity';
import { DocumentTypeAlreadyDeletedException } from '../../domain/exceptions/document-type-already-deleted.exception';
import { IDocumentTypeRepository } from '../../domain/document-type.repository.interface';
import { DeleteDocumentTypeService } from './delete-document-type.service';

describe('DeleteDocumentTypeService', () => {
  let service: DeleteDocumentTypeService;
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

    service = new DeleteDocumentTypeService(documentTypeRepository);
  });

  it('soft deletes a document type that exists and is not deleted', async () => {
    const documentType = DocumentType.create({ name: 'CPF' });
    documentTypeRepository.findById.mockResolvedValue(documentType);

    await service.execute(documentType.id as string);

    expect(documentType.isDeleted).toBe(true);
    expect(documentTypeRepository.delete).toHaveBeenCalledWith(documentType);
  });

  it('throws NotFoundException when the document type does not exist', async () => {
    documentTypeRepository.findById.mockResolvedValue(null);

    await expect(service.execute('missing-id')).rejects.toThrow(
      NotFoundException,
    );

    expect(documentTypeRepository.delete).not.toHaveBeenCalled();
  });

  it('throws DocumentTypeAlreadyDeletedException when the document type is already deleted', async () => {
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

    await expect(service.execute('id-1')).rejects.toThrow(
      DocumentTypeAlreadyDeletedException,
    );

    expect(documentTypeRepository.delete).not.toHaveBeenCalled();
  });
});

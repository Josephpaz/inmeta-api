import { DocumentType } from '../../domain/document-type.entity';
import { DuplicateDocumentTypeNameException } from '../../domain/exceptions/duplicate-document-type-name.exception';
import { IDocumentTypeRepository } from '../../domain/document-type.repository.interface';
import { CreateDocumentTypeService } from './create-document-type.service';

describe('CreateDocumentTypeService', () => {
  let service: CreateDocumentTypeService;
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

    service = new CreateDocumentTypeService(documentTypeRepository);
  });

  it('creates a document type when the name is not in use', async () => {
    documentTypeRepository.findByName.mockResolvedValue(null);
    documentTypeRepository.create.mockImplementation((documentType) =>
      Promise.resolve(documentType),
    );

    const documentType = await service.execute({ name: 'CPF' });

    expect(documentType).toBeInstanceOf(DocumentType);
    expect(documentType.name).toBe('CPF');
    expect(documentTypeRepository.create).toHaveBeenCalledTimes(1);
  });

  it('throws DuplicateDocumentTypeNameException when the name is already in use', async () => {
    const existing = DocumentType.create({ name: 'CPF' });
    documentTypeRepository.findByName.mockResolvedValue(existing);

    await expect(service.execute({ name: 'CPF' })).rejects.toThrow(
      DuplicateDocumentTypeNameException,
    );

    expect(documentTypeRepository.create).not.toHaveBeenCalled();
  });
});

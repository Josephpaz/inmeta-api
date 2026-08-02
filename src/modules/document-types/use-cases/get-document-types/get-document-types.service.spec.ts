import { DocumentType } from '../../domain/document-type.entity';
import { IDocumentTypeRepository } from '../../domain/document-type.repository.interface';
import { GetDocumentTypesService } from './get-document-types.service';

describe('GetDocumentTypesService', () => {
  let service: GetDocumentTypesService;
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

    service = new GetDocumentTypesService(documentTypeRepository);
  });

  it('returns the paginated result from the repository', async () => {
    const documentType = DocumentType.create({ name: 'CPF' });
    const repositoryResult = { data: [documentType], total: 1 };
    documentTypeRepository.findMany.mockResolvedValue(repositoryResult);

    const input = { page: 1, pageSize: 10, name: 'CPF' };
    const result = await service.execute(input);

    expect(documentTypeRepository.findMany).toHaveBeenCalledWith(input);
    expect(result).toBe(repositoryResult);
  });
});

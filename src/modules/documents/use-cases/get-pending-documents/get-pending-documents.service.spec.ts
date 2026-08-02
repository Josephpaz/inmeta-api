import { IDocumentRepository } from '../../domain/document.repository.interface';
import { GetPendingDocumentsService } from './get-pending-documents.service';

describe('GetPendingDocumentsService', () => {
  let service: GetPendingDocumentsService;
  let documentRepository: jest.Mocked<IDocumentRepository>;

  beforeEach(() => {
    documentRepository = {
      create: jest.fn(),
      findLatestByEmployeeAndDocumentType: jest.fn(),
      findPendingDocuments: jest.fn(),
    };

    service = new GetPendingDocumentsService(documentRepository);
  });

  it('returns the paginated result from the repository', async () => {
    const repositoryResult = {
      data: [
        {
          employeeId: 'employee-1',
          employeeName: 'Jane Doe',
          documentTypeId: 'document-type-1',
          documentTypeName: 'CPF',
          requiredSince: new Date(),
        },
      ],
      total: 1,
    };
    documentRepository.findPendingDocuments.mockResolvedValue(repositoryResult);

    const input = { page: 1, pageSize: 10, employeeId: 'employee-1' };
    const result = await service.execute(input);

    expect(documentRepository.findPendingDocuments).toHaveBeenCalledWith(input);
    expect(result).toBe(repositoryResult);
  });
});

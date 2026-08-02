import { IStatisticsRepository } from '../../domain/statistics.repository.interface';
import { GetMostPendingDocumentTypesService } from './get-most-pending-document-types.service';

describe('GetMostPendingDocumentTypesService', () => {
  let service: GetMostPendingDocumentTypesService;
  let statisticsRepository: jest.Mocked<IStatisticsRepository>;

  beforeEach(() => {
    statisticsRepository = {
      getCompletionPercentage: jest.fn(),
      getMostPendingDocumentTypes: jest.fn(),
      getRecentSubmissions: jest.fn(),
    };

    service = new GetMostPendingDocumentTypesService(statisticsRepository);
  });

  it('returns the result from the repository using the given limit', async () => {
    const repositoryResult = [
      {
        documentTypeId: 'document-type-1',
        documentTypeName: 'CPF',
        pendingCount: 8,
      },
    ];
    statisticsRepository.getMostPendingDocumentTypes.mockResolvedValue(
      repositoryResult,
    );

    const result = await service.execute(5);

    expect(
      statisticsRepository.getMostPendingDocumentTypes,
    ).toHaveBeenCalledWith(5);
    expect(result).toBe(repositoryResult);
  });
});

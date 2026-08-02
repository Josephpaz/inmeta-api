import { IStatisticsRepository } from '../../domain/statistics.repository.interface';
import { GetRecentSubmissionsService } from './get-recent-submissions.service';

describe('GetRecentSubmissionsService', () => {
  let service: GetRecentSubmissionsService;
  let statisticsRepository: jest.Mocked<IStatisticsRepository>;

  beforeEach(() => {
    statisticsRepository = {
      getCompletionPercentage: jest.fn(),
      getMostPendingDocumentTypes: jest.fn(),
      getRecentSubmissions: jest.fn(),
    };

    service = new GetRecentSubmissionsService(statisticsRepository);
  });

  it('returns the result from the repository using the given limit', async () => {
    const repositoryResult = [
      {
        documentId: 'document-1',
        employeeId: 'employee-1',
        employeeName: 'Jane Doe',
        documentTypeId: 'document-type-1',
        documentTypeName: 'CPF',
        version: 2,
        submittedAt: new Date(),
      },
    ];
    statisticsRepository.getRecentSubmissions.mockResolvedValue(
      repositoryResult,
    );

    const result = await service.execute(10);

    expect(statisticsRepository.getRecentSubmissions).toHaveBeenCalledWith(10);
    expect(result).toBe(repositoryResult);
  });
});

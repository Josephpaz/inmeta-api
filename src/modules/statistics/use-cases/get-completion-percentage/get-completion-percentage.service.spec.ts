import { IStatisticsRepository } from '../../domain/statistics.repository.interface';
import { GetCompletionPercentageService } from './get-completion-percentage.service';

describe('GetCompletionPercentageService', () => {
  let service: GetCompletionPercentageService;
  let statisticsRepository: jest.Mocked<IStatisticsRepository>;

  beforeEach(() => {
    statisticsRepository = {
      getCompletionPercentage: jest.fn(),
      getMostPendingDocumentTypes: jest.fn(),
      getRecentSubmissions: jest.fn(),
    };

    service = new GetCompletionPercentageService(statisticsRepository);
  });

  it('returns the completion percentage from the repository', async () => {
    statisticsRepository.getCompletionPercentage.mockResolvedValue(62.5);

    const result = await service.execute();

    expect(result).toBe(62.5);
    expect(statisticsRepository.getCompletionPercentage).toHaveBeenCalledTimes(
      1,
    );
  });
});

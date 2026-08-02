import { Injectable } from '@nestjs/common';
import {
  IStatisticsRepository,
  RecentSubmission,
} from '../../domain/statistics.repository.interface';

@Injectable()
export class GetRecentSubmissionsService {
  constructor(private readonly statisticsRepository: IStatisticsRepository) {}

  async execute(limit: number): Promise<RecentSubmission[]> {
    const result = await this.statisticsRepository.getRecentSubmissions(limit);
    return result;
  }
}

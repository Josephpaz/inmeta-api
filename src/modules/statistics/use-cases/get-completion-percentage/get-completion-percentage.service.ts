import { Injectable } from '@nestjs/common';
import { IStatisticsRepository } from '../../domain/statistics.repository.interface';

@Injectable()
export class GetCompletionPercentageService {
  constructor(private readonly statisticsRepository: IStatisticsRepository) {}

  async execute(): Promise<number> {
    const completionPercentage =
      await this.statisticsRepository.getCompletionPercentage();
    return completionPercentage;
  }
}

import { Module } from '@nestjs/common';
import { IStatisticsRepository } from './domain/statistics.repository.interface';
import { StatisticsRepository } from './infrastructure/persistence/statistics.repository';
import { GetCompletionPercentageController } from './use-cases/get-completion-percentage/get-completion-percentage.controller';
import { GetCompletionPercentageService } from './use-cases/get-completion-percentage/get-completion-percentage.service';

@Module({
  controllers: [GetCompletionPercentageController],
  providers: [
    GetCompletionPercentageService,
    {
      provide: IStatisticsRepository,
      useClass: StatisticsRepository,
    },
  ],
  exports: [IStatisticsRepository],
})
export class StatisticsModule {}

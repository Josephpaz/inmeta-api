import { Module } from '@nestjs/common';
import { IStatisticsRepository } from './domain/statistics.repository.interface';
import { StatisticsRepository } from './infrastructure/persistence/statistics.repository';
import { GetCompletionPercentageController } from './use-cases/get-completion-percentage/get-completion-percentage.controller';
import { GetCompletionPercentageService } from './use-cases/get-completion-percentage/get-completion-percentage.service';
import { GetMostPendingDocumentTypesController } from './use-cases/get-most-pending-document-types/get-most-pending-document-types.controller';
import { GetMostPendingDocumentTypesService } from './use-cases/get-most-pending-document-types/get-most-pending-document-types.service';
import { GetRecentSubmissionsController } from './use-cases/get-recent-submissions/get-recent-submissions.controller';
import { GetRecentSubmissionsService } from './use-cases/get-recent-submissions/get-recent-submissions.service';

@Module({
  controllers: [
    GetCompletionPercentageController,
    GetMostPendingDocumentTypesController,
    GetRecentSubmissionsController,
  ],
  providers: [
    GetCompletionPercentageService,
    GetMostPendingDocumentTypesService,
    GetRecentSubmissionsService,
    {
      provide: IStatisticsRepository,
      useClass: StatisticsRepository,
    },
  ],
  exports: [IStatisticsRepository],
})
export class StatisticsModule {}

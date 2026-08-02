import { Injectable } from '@nestjs/common';
import {
  IStatisticsRepository,
  MostPendingDocumentType,
} from '../../domain/statistics.repository.interface';

@Injectable()
export class GetMostPendingDocumentTypesService {
  constructor(private readonly statisticsRepository: IStatisticsRepository) {}

  async execute(limit: number): Promise<MostPendingDocumentType[]> {
    const result =
      await this.statisticsRepository.getMostPendingDocumentTypes(limit);
    return result;
  }
}

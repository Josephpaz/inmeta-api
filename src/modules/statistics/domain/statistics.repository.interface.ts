export interface MostPendingDocumentType {
  documentTypeId: string;
  documentTypeName: string;
  pendingCount: number;
}

export interface RecentSubmission {
  documentId: string;
  employeeId: string;
  employeeName: string;
  documentTypeId: string;
  documentTypeName: string;
  version: number;
  submittedAt: Date;
}

export abstract class IStatisticsRepository {
  abstract getCompletionPercentage(): Promise<number>;
  abstract getMostPendingDocumentTypes(
    limit: number,
  ): Promise<MostPendingDocumentType[]>;
  abstract getRecentSubmissions(limit: number): Promise<RecentSubmission[]>;
}

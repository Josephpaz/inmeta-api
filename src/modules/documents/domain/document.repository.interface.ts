import { Document } from './document.entity';

export interface FindPendingDocumentsParams {
  page: number;
  pageSize: number;
  employeeId?: string;
  documentTypeId?: string;
}

export interface PendingDocumentItem {
  employeeId: string;
  employeeName: string;
  documentTypeId: string;
  documentTypeName: string;
  requiredSince: Date;
}

export interface FindPendingDocumentsResult {
  data: PendingDocumentItem[];
  total: number;
}

export abstract class IDocumentRepository {
  abstract create(document: Document): Promise<Document>;
  abstract findLatestByEmployeeAndDocumentType(
    employeeId: string,
    documentTypeId: string,
  ): Promise<Document | null>;
  abstract findPendingDocuments(
    params: FindPendingDocumentsParams,
  ): Promise<FindPendingDocumentsResult>;
}

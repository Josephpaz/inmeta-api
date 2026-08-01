import { DocumentType } from './document-type.entity';

export interface FindManyDocumentTypesParams {
  page: number;
  pageSize: number;
  name?: string;
}

export interface FindManyDocumentTypesResult {
  data: DocumentType[];
  total: number;
}

export abstract class IDocumentTypeRepository {
  abstract create(documentType: DocumentType): Promise<DocumentType>;
  abstract delete(documentType: DocumentType): Promise<void>;
  abstract restore(documentType: DocumentType): Promise<void>;
  abstract findById(id: string): Promise<DocumentType | null>;
  abstract findByName(name: string): Promise<DocumentType | null>;
  abstract findMany(
    params: FindManyDocumentTypesParams,
  ): Promise<FindManyDocumentTypesResult>;
}

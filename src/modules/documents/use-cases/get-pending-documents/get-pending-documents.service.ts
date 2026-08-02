import { Injectable } from '@nestjs/common';
import {
  IDocumentRepository,
  FindPendingDocumentsResult,
} from '../../domain/document.repository.interface';

interface GetPendingDocumentsInput {
  page: number;
  pageSize: number;
  employeeId?: string;
  documentTypeId?: string;
}

@Injectable()
export class GetPendingDocumentsService {
  constructor(private readonly documentRepository: IDocumentRepository) {}

  async execute(
    input: GetPendingDocumentsInput,
  ): Promise<FindPendingDocumentsResult> {
    const result = await this.documentRepository.findPendingDocuments(input);
    return result;
  }
}

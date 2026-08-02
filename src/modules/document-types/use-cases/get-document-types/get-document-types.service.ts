import { Injectable } from '@nestjs/common';
import {
  IDocumentTypeRepository,
  FindManyDocumentTypesResult,
} from '../../domain/document-type.repository.interface';

interface GetDocumentTypesInput {
  page: number;
  pageSize: number;
  name?: string;
}

@Injectable()
export class GetDocumentTypesService {
  constructor(
    private readonly documentTypeRepository: IDocumentTypeRepository,
  ) {}

  async execute(
    input: GetDocumentTypesInput,
  ): Promise<FindManyDocumentTypesResult> {
    const result = await this.documentTypeRepository.findMany(input);
    return result;
  }
}

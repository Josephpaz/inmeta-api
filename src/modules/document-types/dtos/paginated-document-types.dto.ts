import { ApiProperty } from '@nestjs/swagger';
import { DocumentType } from '../domain/document-type.entity';
import { DocumentTypeDto } from './document-type.dto';

export class PaginatedDocumentTypesDto {
  @ApiProperty({ type: [DocumentTypeDto] })
  data!: DocumentTypeDto[];

  @ApiProperty()
  total!: number;

  @ApiProperty()
  page!: number;

  @ApiProperty()
  pageSize!: number;

  static fromDomain(
    result: { data: DocumentType[]; total: number },
    page: number,
    pageSize: number,
  ): PaginatedDocumentTypesDto {
    const dto = new PaginatedDocumentTypesDto();

    dto.data = result.data.map(DocumentTypeDto.fromDomain);
    dto.total = result.total;
    dto.page = page;
    dto.pageSize = pageSize;

    return dto;
  }
}

import { ApiProperty } from '@nestjs/swagger';
import { PendingDocumentItem } from '../domain/document.repository.interface';
import { PendingDocumentItemDto } from './pending-document-item.dto';

export class PaginatedPendingDocumentsDto {
  @ApiProperty({ type: [PendingDocumentItemDto] })
  data!: PendingDocumentItemDto[];

  @ApiProperty()
  total!: number;

  @ApiProperty()
  page!: number;

  @ApiProperty()
  pageSize!: number;

  static fromDomain(
    result: { data: PendingDocumentItem[]; total: number },
    page: number,
    pageSize: number,
  ): PaginatedPendingDocumentsDto {
    const dto = new PaginatedPendingDocumentsDto();

    dto.data = result.data.map(PendingDocumentItemDto.fromDomain);
    dto.total = result.total;
    dto.page = page;
    dto.pageSize = pageSize;

    return dto;
  }
}

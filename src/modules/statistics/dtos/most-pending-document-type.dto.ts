import { ApiProperty } from '@nestjs/swagger';
import { MostPendingDocumentType } from '../domain/statistics.repository.interface';

export class MostPendingDocumentTypeDto {
  @ApiProperty()
  documentTypeId!: string;

  @ApiProperty()
  documentTypeName!: string;

  @ApiProperty()
  pendingCount!: number;

  static fromDomain(item: MostPendingDocumentType): MostPendingDocumentTypeDto {
    const dto = new MostPendingDocumentTypeDto();

    dto.documentTypeId = item.documentTypeId;
    dto.documentTypeName = item.documentTypeName;
    dto.pendingCount = item.pendingCount;

    return dto;
  }
}

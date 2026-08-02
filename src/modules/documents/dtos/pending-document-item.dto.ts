import { ApiProperty } from '@nestjs/swagger';
import { PendingDocumentItem } from '../domain/document.repository.interface';

export class PendingDocumentItemDto {
  @ApiProperty()
  employeeId!: string;

  @ApiProperty()
  employeeName!: string;

  @ApiProperty()
  documentTypeId!: string;

  @ApiProperty()
  documentTypeName!: string;

  @ApiProperty()
  requiredSince!: Date;

  static fromDomain(item: PendingDocumentItem): PendingDocumentItemDto {
    const dto = new PendingDocumentItemDto();

    dto.employeeId = item.employeeId;
    dto.employeeName = item.employeeName;
    dto.documentTypeId = item.documentTypeId;
    dto.documentTypeName = item.documentTypeName;
    dto.requiredSince = item.requiredSince;

    return dto;
  }
}

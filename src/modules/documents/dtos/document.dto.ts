import { ApiProperty } from '@nestjs/swagger';
import { Document } from '../domain/document.entity';

export class DocumentDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  employeeId!: string;

  @ApiProperty()
  documentTypeId!: string;

  @ApiProperty()
  version!: number;

  @ApiProperty()
  submittedAt!: Date;

  static fromDomain(document: Document): DocumentDto {
    const dto = new DocumentDto();

    dto.id = document.id as string;
    dto.employeeId = document.employeeId;
    dto.documentTypeId = document.documentTypeId;
    dto.version = document.version;
    dto.submittedAt = document.createdAt as Date;

    return dto;
  }
}

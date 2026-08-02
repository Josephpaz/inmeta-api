import { ApiProperty } from '@nestjs/swagger';
import { DocumentType } from '../domain/document-type.entity';

export class DocumentTypeDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  static fromDomain(documentType: DocumentType): DocumentTypeDto {
    const dto = new DocumentTypeDto();

    dto.id = documentType.id as string;
    dto.name = documentType.name;
    dto.createdAt = documentType.createdAt as Date;
    dto.updatedAt = documentType.updatedAt as Date;

    return dto;
  }
}

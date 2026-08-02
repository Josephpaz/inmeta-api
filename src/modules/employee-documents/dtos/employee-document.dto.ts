import { ApiProperty } from '@nestjs/swagger';
import { EmployeeDocument } from '../domain/employee-document.entity';

export class EmployeeDocumentDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  employeeId!: string;

  @ApiProperty()
  documentTypeId!: string;

  @ApiProperty()
  createdAt!: Date;

  static fromDomain(employeeDocument: EmployeeDocument): EmployeeDocumentDto {
    const dto = new EmployeeDocumentDto();

    dto.id = employeeDocument.id as string;
    dto.employeeId = employeeDocument.employeeId;
    dto.documentTypeId = employeeDocument.documentTypeId;
    dto.createdAt = employeeDocument.createdAt as Date;

    return dto;
  }
}

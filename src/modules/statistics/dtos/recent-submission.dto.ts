import { ApiProperty } from '@nestjs/swagger';
import { RecentSubmission } from '../domain/statistics.repository.interface';

export class RecentSubmissionDto {
  @ApiProperty()
  documentId!: string;

  @ApiProperty()
  employeeId!: string;

  @ApiProperty()
  employeeName!: string;

  @ApiProperty()
  documentTypeId!: string;

  @ApiProperty()
  documentTypeName!: string;

  @ApiProperty()
  version!: number;

  @ApiProperty()
  submittedAt!: Date;

  static fromDomain(item: RecentSubmission): RecentSubmissionDto {
    const dto = new RecentSubmissionDto();

    dto.documentId = item.documentId;
    dto.employeeId = item.employeeId;
    dto.employeeName = item.employeeName;
    dto.documentTypeId = item.documentTypeId;
    dto.documentTypeName = item.documentTypeName;
    dto.version = item.version;
    dto.submittedAt = item.submittedAt;

    return dto;
  }
}

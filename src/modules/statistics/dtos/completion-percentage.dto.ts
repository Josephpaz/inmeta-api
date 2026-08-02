import { ApiProperty } from '@nestjs/swagger';

export class CompletionPercentageDto {
  @ApiProperty({
    description:
      'Percentage of required documents that have already been submitted, across the whole system.',
  })
  completionPercentage!: number;

  static fromValue(completionPercentage: number): CompletionPercentageDto {
    const dto = new CompletionPercentageDto();
    dto.completionPercentage = completionPercentage;
    return dto;
  }
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDocumentTypeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name!: string;
}

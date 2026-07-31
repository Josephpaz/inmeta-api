import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateEmployeeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty()
  @IsEmail()
  email!: string;
}

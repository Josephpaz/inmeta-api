import { ApiProperty } from '@nestjs/swagger';
import { Employee } from '../domain/employee.entity';

export class EmployeeDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  static fromDomain(employee: Employee): EmployeeDto {
    const dto = new EmployeeDto();

    dto.id = employee.id as string;
    dto.name = employee.name;
    dto.email = employee.email;
    dto.createdAt = employee.createdAt as Date;
    dto.updatedAt = employee.updatedAt as Date;

    return dto;
  }
}

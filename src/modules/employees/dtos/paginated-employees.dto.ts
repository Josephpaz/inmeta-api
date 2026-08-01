import { ApiProperty } from '@nestjs/swagger';
import { Employee } from '../domain/employee.entity';
import { EmployeeDto } from './employee.dto';

export class PaginatedEmployeesDto {
  @ApiProperty({ type: [EmployeeDto] })
  data!: EmployeeDto[];

  @ApiProperty()
  total!: number;

  @ApiProperty()
  page!: number;

  @ApiProperty()
  pageSize!: number;

  static fromDomain(
    result: { data: Employee[]; total: number },
    page: number,
    pageSize: number,
  ): PaginatedEmployeesDto {
    const dto = new PaginatedEmployeesDto();

    dto.data = result.data.map(EmployeeDto.fromDomain);
    dto.total = result.total;
    dto.page = page;
    dto.pageSize = pageSize;

    return dto;
  }
}

import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetEmployeesQueryDto } from '../../dtos/get-employees-query.dto';
import { PaginatedEmployeesDto } from '../../dtos/paginated-employees.dto';
import { GetEmployeesService } from './get-employees.service';

@ApiTags('employees')
@Controller('employees')
export class GetEmployeesController {
  constructor(private readonly getEmployeesService: GetEmployeesService) {}

  @Get()
  @ApiOperation({ summary: 'List employees with pagination and filters' })
  @ApiOkResponse({
    description: 'Paginated list of employees.',
    type: PaginatedEmployeesDto,
  })
  async handle(
    @Query() query: GetEmployeesQueryDto,
  ): Promise<PaginatedEmployeesDto> {
    const result = await this.getEmployeesService.execute(query);
    return PaginatedEmployeesDto.fromDomain(result, query.page, query.pageSize);
  }
}

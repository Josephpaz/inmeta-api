import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { EmployeeDto } from '../../dtos/employee.dto';
import { GetEmployeeService } from './get-employee.service';

@ApiTags('employees')
@Controller('employees')
export class GetEmployeeController {
  constructor(private readonly getEmployeeService: GetEmployeeService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get an employee by id' })
  @ApiOkResponse({ description: 'Employee found.', type: EmployeeDto })
  @ApiNotFoundResponse({ description: 'Employee not found.' })
  async handle(@Param('id') id: string): Promise<EmployeeDto> {
    const employee = await this.getEmployeeService.execute(id);
    return EmployeeDto.fromDomain(employee);
  }
}

import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { CreateEmployeeDto } from '../../dtos/create-employee.dto';
import { EmployeeDto } from '../../dtos/employee.dto';
import { CreateEmployeeService } from './create-employee.service';

@ApiTags('employees')
@Controller('employees')
export class CreateEmployeeController {
  constructor(private readonly createEmployeeService: CreateEmployeeService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new employee' })
  @ApiCreatedResponse({
    description: 'Employee successfully created.',
    type: EmployeeDto,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid name or email.',
  })
  @ApiConflictResponse({
    description: 'An employee with the given email already exists.',
  })
  async handle(@Body() body: CreateEmployeeDto): Promise<EmployeeDto> {
    const employee = await this.createEmployeeService.execute(body);
    return EmployeeDto.fromDomain(employee);
  }
}

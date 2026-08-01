import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { DeleteEmployeeService } from './delete-employee.service';

@ApiTags('employees')
@Controller('employees')
export class DeleteEmployeeController {
  constructor(private readonly deleteEmployeeService: DeleteEmployeeService) {}

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete an employee' })
  @ApiNoContentResponse({ description: 'Employee successfully deleted.' })
  @ApiNotFoundResponse({ description: 'Employee not found.' })
  @ApiConflictResponse({ description: 'Employee is already deleted.' })
  async handle(@Param('id') id: string): Promise<void> {
    await this.deleteEmployeeService.execute(id);
  }
}

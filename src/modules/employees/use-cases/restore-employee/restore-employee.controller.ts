import { Controller, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { RestoreEmployeeService } from './restore-employee.service';

@ApiTags('employees')
@Controller('employees')
export class RestoreEmployeeController {
  constructor(
    private readonly restoreEmployeeService: RestoreEmployeeService,
  ) {}

  @Post(':id/restore')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Restore a soft deleted employee' })
  @ApiNoContentResponse({ description: 'Employee successfully restored.' })
  @ApiNotFoundResponse({ description: 'Employee not found.' })
  @ApiConflictResponse({ description: 'Employee is not deleted.' })
  async handle(@Param('id') id: string): Promise<void> {
    await this.restoreEmployeeService.execute(id);
  }
}

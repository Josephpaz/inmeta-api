import { Controller, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiGoneResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { EmployeeDocumentDto } from '../../dtos/employee-document.dto';
import { CreateEmployeeDocumentService } from './create-employee-document.service';

@ApiTags('employee-documents')
@Controller('employees/:employeeId/document-types/:documentTypeId')
export class CreateEmployeeDocumentController {
  constructor(
    private readonly createEmployeeDocumentService: CreateEmployeeDocumentService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Link a document type to an employee as required',
  })
  @ApiCreatedResponse({
    description: 'Document type successfully linked to the employee.',
    type: EmployeeDocumentDto,
  })
  @ApiNotFoundResponse({ description: 'Employee or document type not found.' })
  @ApiGoneResponse({
    description: 'Employee or document type was removed.',
  })
  @ApiConflictResponse({
    description: 'Employee is already linked to this document type.',
  })
  async handle(
    @Param('employeeId') employeeId: string,
    @Param('documentTypeId') documentTypeId: string,
  ): Promise<EmployeeDocumentDto> {
    const employeeDocument = await this.createEmployeeDocumentService.execute({
      employeeId,
      documentTypeId,
    });
    return EmployeeDocumentDto.fromDomain(employeeDocument);
  }
}

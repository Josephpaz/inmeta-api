import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import {
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { DeleteEmployeeDocumentService } from './delete-employee-document.service';

@ApiTags('employee-documents')
@Controller('employees/:employeeId/document-types/:documentTypeId')
export class DeleteEmployeeDocumentController {
  constructor(
    private readonly deleteEmployeeDocumentService: DeleteEmployeeDocumentService,
  ) {}

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Unlink a document type from an employee',
  })
  @ApiNoContentResponse({
    description: 'Document type successfully unlinked from the employee.',
  })
  @ApiNotFoundResponse({
    description: 'Employee is not linked to this document type.',
  })
  async handle(
    @Param('employeeId') employeeId: string,
    @Param('documentTypeId') documentTypeId: string,
  ): Promise<void> {
    await this.deleteEmployeeDocumentService.execute(
      employeeId,
      documentTypeId,
    );
  }
}

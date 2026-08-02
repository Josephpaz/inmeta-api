import { Controller, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiGoneResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { DocumentDto } from '../../dtos/document.dto';
import { SubmitDocumentService } from './submit-document.service';

@ApiTags('documents')
@Controller('employees/:employeeId/document-types/:documentTypeId/documents')
export class SubmitDocumentController {
  constructor(private readonly submitDocumentService: SubmitDocumentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary:
      'Submit a document for an employee, creating a new version (resubmission is allowed and keeps history)',
  })
  @ApiCreatedResponse({
    description: 'Document successfully submitted.',
    type: DocumentDto,
  })
  @ApiNotFoundResponse({
    description:
      'Employee/document type not found, or employee is not required to submit this document type.',
  })
  @ApiGoneResponse({ description: 'Employee or document type was removed.' })
  @ApiConflictResponse({
    description:
      'A concurrent submission for the same employee and document type was processed at the same time.',
  })
  async handle(
    @Param('employeeId') employeeId: string,
    @Param('documentTypeId') documentTypeId: string,
  ): Promise<DocumentDto> {
    const document = await this.submitDocumentService.execute({
      employeeId,
      documentTypeId,
    });
    return DocumentDto.fromDomain(document);
  }
}

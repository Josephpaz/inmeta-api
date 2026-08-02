import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { CreateDocumentTypeDto } from '../../dtos/create-document-type.dto';
import { DocumentTypeDto } from '../../dtos/document-type.dto';
import { CreateDocumentTypeService } from './create-document-type.service';

@ApiTags('document-types')
@Controller('document-types')
export class CreateDocumentTypeController {
  constructor(
    private readonly createDocumentTypeService: CreateDocumentTypeService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new document type' })
  @ApiCreatedResponse({
    description: 'Document type successfully created.',
    type: DocumentTypeDto,
  })
  @ApiUnprocessableEntityResponse({ description: 'Invalid name.' })
  @ApiConflictResponse({
    description: 'A document type with the given name already exists.',
  })
  async handle(@Body() body: CreateDocumentTypeDto): Promise<DocumentTypeDto> {
    const documentType = await this.createDocumentTypeService.execute(body);
    return DocumentTypeDto.fromDomain(documentType);
  }
}

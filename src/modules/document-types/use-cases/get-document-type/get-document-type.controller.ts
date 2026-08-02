import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiGoneResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { DocumentTypeDto } from '../../dtos/document-type.dto';
import { GetDocumentTypeService } from './get-document-type.service';

@ApiTags('document-types')
@Controller('document-types')
export class GetDocumentTypeController {
  constructor(
    private readonly getDocumentTypeService: GetDocumentTypeService,
  ) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get a document type by id' })
  @ApiOkResponse({ description: 'Document type found.', type: DocumentTypeDto })
  @ApiNotFoundResponse({ description: 'Document type was never registered.' })
  @ApiGoneResponse({
    description:
      'Document type was registered but is now inactive (soft deleted).',
  })
  async handle(@Param('id') id: string): Promise<DocumentTypeDto> {
    const documentType = await this.getDocumentTypeService.execute(id);
    return DocumentTypeDto.fromDomain(documentType);
  }
}

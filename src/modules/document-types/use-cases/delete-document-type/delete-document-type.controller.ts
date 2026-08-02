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
import { DeleteDocumentTypeService } from './delete-document-type.service';

@ApiTags('document-types')
@Controller('document-types')
export class DeleteDocumentTypeController {
  constructor(
    private readonly deleteDocumentTypeService: DeleteDocumentTypeService,
  ) {}

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete a document type' })
  @ApiNoContentResponse({ description: 'Document type successfully deleted.' })
  @ApiNotFoundResponse({ description: 'Document type not found.' })
  @ApiConflictResponse({ description: 'Document type is already deleted.' })
  async handle(@Param('id') id: string): Promise<void> {
    await this.deleteDocumentTypeService.execute(id);
  }
}

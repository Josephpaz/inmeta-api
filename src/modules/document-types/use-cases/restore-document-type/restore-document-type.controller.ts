import { Controller, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { RestoreDocumentTypeService } from './restore-document-type.service';

@ApiTags('document-types')
@Controller('document-types')
export class RestoreDocumentTypeController {
  constructor(
    private readonly restoreDocumentTypeService: RestoreDocumentTypeService,
  ) {}

  @Post(':id/restore')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Restore a soft deleted document type' })
  @ApiNoContentResponse({
    description: 'Document type successfully restored.',
  })
  @ApiNotFoundResponse({ description: 'Document type not found.' })
  @ApiConflictResponse({ description: 'Document type is not deleted.' })
  async handle(@Param('id') id: string): Promise<void> {
    await this.restoreDocumentTypeService.execute(id);
  }
}

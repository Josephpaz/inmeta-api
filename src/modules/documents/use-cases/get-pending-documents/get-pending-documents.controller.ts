import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetPendingDocumentsQueryDto } from '../../dtos/get-pending-documents-query.dto';
import { PaginatedPendingDocumentsDto } from '../../dtos/paginated-pending-documents.dto';
import { GetPendingDocumentsService } from './get-pending-documents.service';

@ApiTags('documents')
@Controller('documents/pending')
export class GetPendingDocumentsController {
  constructor(
    private readonly getPendingDocumentsService: GetPendingDocumentsService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'List pending documents with pagination and filters',
  })
  @ApiOkResponse({
    description: 'Paginated list of pending documents.',
    type: PaginatedPendingDocumentsDto,
  })
  async handle(
    @Query() query: GetPendingDocumentsQueryDto,
  ): Promise<PaginatedPendingDocumentsDto> {
    const result = await this.getPendingDocumentsService.execute(query);
    return PaginatedPendingDocumentsDto.fromDomain(
      result,
      query.page,
      query.pageSize,
    );
  }
}

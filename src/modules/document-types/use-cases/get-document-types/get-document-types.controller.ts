import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetDocumentTypesQueryDto } from '../../dtos/get-document-types-query.dto';
import { PaginatedDocumentTypesDto } from '../../dtos/paginated-document-types.dto';
import { GetDocumentTypesService } from './get-document-types.service';

@ApiTags('document-types')
@Controller('document-types')
export class GetDocumentTypesController {
  constructor(
    private readonly getDocumentTypesService: GetDocumentTypesService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List document types with pagination and filters' })
  @ApiOkResponse({
    description: 'Paginated list of document types.',
    type: PaginatedDocumentTypesDto,
  })
  async handle(
    @Query() query: GetDocumentTypesQueryDto,
  ): Promise<PaginatedDocumentTypesDto> {
    const result = await this.getDocumentTypesService.execute(query);
    return PaginatedDocumentTypesDto.fromDomain(
      result,
      query.page,
      query.pageSize,
    );
  }
}

import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetMostPendingDocumentTypesQueryDto } from '../../dtos/get-most-pending-document-types-query.dto';
import { MostPendingDocumentTypeDto } from '../../dtos/most-pending-document-type.dto';
import { GetMostPendingDocumentTypesService } from './get-most-pending-document-types.service';

@ApiTags('statistics')
@Controller('statistics/most-pending-document-types')
export class GetMostPendingDocumentTypesController {
  constructor(
    private readonly getMostPendingDocumentTypesService: GetMostPendingDocumentTypesService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get the document types with the most pending submissions',
  })
  @ApiOkResponse({
    description: 'Document types ranked by pending count.',
    type: [MostPendingDocumentTypeDto],
  })
  async handle(
    @Query() query: GetMostPendingDocumentTypesQueryDto,
  ): Promise<MostPendingDocumentTypeDto[]> {
    const result = await this.getMostPendingDocumentTypesService.execute(
      query.limit,
    );
    return result.map(MostPendingDocumentTypeDto.fromDomain);
  }
}

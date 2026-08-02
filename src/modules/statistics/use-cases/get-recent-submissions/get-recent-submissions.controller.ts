import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetRecentSubmissionsQueryDto } from '../../dtos/get-recent-submissions-query.dto';
import { RecentSubmissionDto } from '../../dtos/recent-submission.dto';
import { GetRecentSubmissionsService } from './get-recent-submissions.service';

@ApiTags('statistics')
@Controller('statistics/recent-submissions')
export class GetRecentSubmissionsController {
  constructor(
    private readonly getRecentSubmissionsService: GetRecentSubmissionsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get the most recent document submissions' })
  @ApiOkResponse({
    description: 'Recent document submissions, most recent first.',
    type: [RecentSubmissionDto],
  })
  async handle(
    @Query() query: GetRecentSubmissionsQueryDto,
  ): Promise<RecentSubmissionDto[]> {
    const result = await this.getRecentSubmissionsService.execute(query.limit);
    return result.map(RecentSubmissionDto.fromDomain);
  }
}

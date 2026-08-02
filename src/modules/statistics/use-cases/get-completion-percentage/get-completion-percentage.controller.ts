import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CompletionPercentageDto } from '../../dtos/completion-percentage.dto';
import { GetCompletionPercentageService } from './get-completion-percentage.service';

@ApiTags('statistics')
@Controller('statistics/completion-percentage')
export class GetCompletionPercentageController {
  constructor(
    private readonly getCompletionPercentageService: GetCompletionPercentageService,
  ) {}

  @Get()
  @ApiOperation({
    summary:
      'Get the global percentage of required documents already submitted',
  })
  @ApiOkResponse({
    description: 'Global completion percentage.',
    type: CompletionPercentageDto,
  })
  async handle(): Promise<CompletionPercentageDto> {
    const completionPercentage =
      await this.getCompletionPercentageService.execute();
    return CompletionPercentageDto.fromValue(completionPercentage);
  }
}

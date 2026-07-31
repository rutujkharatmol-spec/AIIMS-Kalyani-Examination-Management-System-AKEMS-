import { Controller, Post, Param } from '@nestjs/common';
import { ResultsService } from '../services/results.service';

@Controller('results')
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @Post('compute/:examCycleId')
  async compute(@Param('examCycleId') examCycleId: string) {
    return this.resultsService.computeResults(examCycleId);
  }

  @Post('publish/:examCycleId')
  async publish(@Param('examCycleId') examCycleId: string) {
    return this.resultsService.publishResults(examCycleId);
  }
}

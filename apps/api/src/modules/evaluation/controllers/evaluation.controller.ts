import { Controller, Post, Body } from '@nestjs/common';
import { EvaluationService } from '../services/evaluation.service';

@Controller('evaluations')
export class EvaluationController {
  constructor(private readonly evaluationService: EvaluationService) {}

  @Post('allocate')
  async allocate(@Body() body: any) {
    return this.evaluationService.allocateSheet(body.answerSheetId, body.evaluatorId);
  }
}

import { Controller, Post, Body } from '@nestjs/common';
import { ReEvaluationService } from '../services/re-evaluation.service';

@Controller('re-evaluation')
export class ReEvaluationController {
  constructor(private readonly reEvaluationService: ReEvaluationService) {}

  @Post('request')
  async requestReEvaluation(@Body() body: any) {
    return this.reEvaluationService.submitRequest(body.studentId, body.answerSheetId, body.reason);
  }
}

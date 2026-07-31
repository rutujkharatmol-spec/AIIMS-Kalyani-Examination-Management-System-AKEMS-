import { Module } from '@nestjs/common';
import { ReEvaluationController } from './controllers/re-evaluation.controller';
import { ReEvaluationService } from './services/re-evaluation.service';

@Module({
  controllers: [ReEvaluationController],
  providers: [ReEvaluationService]
})
export class ReEvaluationModule {}

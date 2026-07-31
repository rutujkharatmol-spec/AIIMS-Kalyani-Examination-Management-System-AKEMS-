import { Module } from '@nestjs/common';
import { QuestionPaperController } from './controllers/question-paper.controller';
import { QuestionPaperService } from './services/question-paper.service';

@Module({
  controllers: [QuestionPaperController],
  providers: [QuestionPaperService]
})
export class QuestionPaperModule {}

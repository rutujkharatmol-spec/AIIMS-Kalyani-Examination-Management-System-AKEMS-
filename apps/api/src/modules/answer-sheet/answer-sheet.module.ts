import { Module } from '@nestjs/common';
import { AnswerSheetController } from './controllers/answer-sheet.controller';
import { AnswerSheetService } from './services/answer-sheet.service';

@Module({
  controllers: [AnswerSheetController],
  providers: [AnswerSheetService]
})
export class AnswerSheetModule {}

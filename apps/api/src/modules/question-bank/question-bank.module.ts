import { Module } from '@nestjs/common';
import { QuestionBankController } from './controllers/question-bank.controller';
import { QuestionBankService } from './services/question-bank.service';

@Module({
  controllers: [QuestionBankController],
  providers: [QuestionBankService]
})
export class QuestionBankModule {}

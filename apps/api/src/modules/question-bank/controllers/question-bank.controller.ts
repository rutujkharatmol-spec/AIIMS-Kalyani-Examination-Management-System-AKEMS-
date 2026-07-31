import { Controller, Get, Param } from '@nestjs/common';
import { QuestionBankService } from '../services/question-bank.service';

@Controller('question-bank')
export class QuestionBankController {
  constructor(private readonly questionBankService: QuestionBankService) {}

  @Get('subject/:id')
  async getQuestions(@Param('id') id: string) {
    return { success: true, data: await this.questionBankService.getQuestionsBySubject(id) };
  }
}

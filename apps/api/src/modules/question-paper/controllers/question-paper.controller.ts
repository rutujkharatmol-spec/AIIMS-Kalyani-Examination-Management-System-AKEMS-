import { Controller, Post, Body } from '@nestjs/common';
import { QuestionPaperService } from '../services/question-paper.service';

@Controller('question-papers')
export class QuestionPaperController {
  constructor(private readonly questionPaperService: QuestionPaperService) {}

  @Post('generate')
  async generate(@Body() body: any) {
    return this.questionPaperService.generateFromBlueprint(body.subjectId, body.blueprint);
  }
}

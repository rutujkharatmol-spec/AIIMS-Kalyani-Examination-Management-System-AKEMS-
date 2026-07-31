import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExamCycleService } from '../services/exam-cycle.service';

@Controller('exam-cycles')
@UseGuards(AuthGuard('jwt'))
export class ExamCycleController {
  constructor(private readonly examCycleService: ExamCycleService) {}

  @Get()
  async getExamCycles() {
    return { success: true, data: await this.examCycleService.findAll() };
  }
}

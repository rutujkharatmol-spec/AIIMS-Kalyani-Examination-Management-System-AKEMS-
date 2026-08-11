import { Controller, Get, Post, Body, UseGuards, Param, Patch, Delete } from '@nestjs/common';
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

  @Post()
  async createExamCycle(@Body() data: any) {
    return { success: true, data: await this.examCycleService.create(data) };
  }

  @Patch(':id')
  async updateExamCycle(@Param('id') id: string, @Body() data: any) {
    return { success: true, data: await this.examCycleService.update(id, data) };
  }

  @Delete(':id')
  async deleteExamCycle(@Param('id') id: string) {
    return { success: true, data: await this.examCycleService.remove(id) };
  }
}

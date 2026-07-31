import { Controller, Get } from '@nestjs/common';
import { SchedulerService } from '../services/scheduler.service';

@Controller('scheduler')
export class SchedulerController {
  constructor(private readonly schedulerService: SchedulerService) {}

  @Get('status')
  async getStatus() {
    return { success: true, data: await this.schedulerService.getStatus() };
  }
}

import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('widgets')
  async getWidgets() {
    const data = await this.dashboardService.getWidgets();
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }
}

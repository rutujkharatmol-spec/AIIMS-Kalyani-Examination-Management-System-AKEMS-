import { Controller, Get, Query } from '@nestjs/common';
import { AuditService } from '../services/audit.service';

@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  async getLogs(@Query('limit') limit: number = 20) {
    return {
      success: true,
      data: await this.auditService.getRecentLogs(limit),
      timestamp: new Date().toISOString()
    };
  }
}

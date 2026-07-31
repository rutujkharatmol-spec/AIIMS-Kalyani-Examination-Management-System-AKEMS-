import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { WorkflowService } from '../services/workflow.service';

@Controller('workflows')
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  @Get('pending')
  async getPendingApprovals() {
    return {
      success: true,
      data: await this.workflowService.getPendingApprovals('mock-role')
    };
  }

  @Post('instances/:id/approve')
  async approve(@Param('id') id: string, @Body() body: any) {
    return { success: true, message: 'Workflow instance approved' };
  }
}

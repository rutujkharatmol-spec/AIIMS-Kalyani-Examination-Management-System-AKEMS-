import { Injectable } from '@nestjs/common';

@Injectable()
export class WorkflowService {
  async getPendingApprovals(role: string) {
    // Mock pending approvals
    return [
      { id: 'inst-1', entity_type: 'question_paper', status: 'PENDING', step: 'HOD Review' }
    ];
  }
}

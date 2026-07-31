import { Injectable } from '@nestjs/common';

@Injectable()
export class HallTicketService {
  async generateForCycle(examCycleId: string) {
    return { success: true, count: 150 };
  }
}

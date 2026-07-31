import { Injectable } from '@nestjs/common';

@Injectable()
export class ReEvaluationService {
  async submitRequest(studentId: string, answerSheetId: string, reason: string) {
    return { success: true, requestId: 'mock-req-id', status: 'PENDING' };
  }
}

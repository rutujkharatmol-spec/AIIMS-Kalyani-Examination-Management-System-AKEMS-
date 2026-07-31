import { Injectable } from '@nestjs/common';

@Injectable()
export class EvaluationService {
  async allocateSheet(answerSheetId: string, evaluatorId: string) {
    return { success: true, status: 'ASSIGNED' };
  }
}

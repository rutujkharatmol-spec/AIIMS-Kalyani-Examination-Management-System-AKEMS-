import { Injectable } from '@nestjs/common';

@Injectable()
export class QuestionBankService {
  async getQuestionsBySubject(subjectId: string) {
    return [{ id: 'q-1', text: 'Sample MCQ Question', type: 'MCQ', status: 'APPROVED' }];
  }
}

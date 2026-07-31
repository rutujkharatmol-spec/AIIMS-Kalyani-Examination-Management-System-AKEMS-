import { Injectable } from '@nestjs/common';

@Injectable()
export class QuestionPaperService {
  async generateFromBlueprint(subjectId: string, blueprint: any) {
    return { success: true, paperId: 'mock-qp-id', status: 'DRAFT' };
  }
}

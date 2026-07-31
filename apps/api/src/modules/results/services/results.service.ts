import { Injectable } from '@nestjs/common';

@Injectable()
export class ResultsService {
  async computeResults(examCycleId: string) {
    return { success: true, message: `Results computed for cycle ${examCycleId}` };
  }

  async publishResults(examCycleId: string) {
    return { success: true, message: `Results published for cycle ${examCycleId}` };
  }
}

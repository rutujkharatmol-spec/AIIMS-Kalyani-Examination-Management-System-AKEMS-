import { Injectable } from '@nestjs/common';

@Injectable()
export class MarksheetService {
  async generateMarksheet(studentId: string, examCycleId: string) {
    return { success: true, url: `/downloads/marksheet_${studentId}.pdf` };
  }
}

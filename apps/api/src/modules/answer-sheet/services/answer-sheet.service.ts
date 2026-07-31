import { Injectable } from '@nestjs/common';

@Injectable()
export class AnswerSheetService {
  async registerScannedSheet(barcode: string, pdfPath: string) {
    const dummyNumber = `DUMMY-${Math.floor(Math.random() * 1000000)}`;
    return { success: true, dummyNumber, status: 'SCANNED' };
  }
}

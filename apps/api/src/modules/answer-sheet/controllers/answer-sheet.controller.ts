import { Controller, Post, Body } from '@nestjs/common';
import { AnswerSheetService } from '../services/answer-sheet.service';

@Controller('answer-sheets')
export class AnswerSheetController {
  constructor(private readonly answerSheetService: AnswerSheetService) {}

  @Post('scan')
  async scanSheet(@Body() body: any) {
    return this.answerSheetService.registerScannedSheet(body.barcode, body.pdfPath);
  }
}

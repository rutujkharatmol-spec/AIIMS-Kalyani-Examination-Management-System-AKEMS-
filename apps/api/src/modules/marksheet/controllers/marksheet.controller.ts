import { Controller, Post, Body } from '@nestjs/common';
import { MarksheetService } from '../services/marksheet.service';

@Controller('marksheets')
export class MarksheetController {
  constructor(private readonly marksheetService: MarksheetService) {}

  @Post('generate')
  async generate(@Body() body: any) {
    return this.marksheetService.generateMarksheet(body.studentId, body.examCycleId);
  }
}

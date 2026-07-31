import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { ExcelService } from '../services/excel.service';

@Controller('excel')
export class ExcelController {
  constructor(private readonly excelService: ExcelService) {}

  @Post('validate')
  async validateImport(@Body() body: any) {
    return { success: true, data: await this.excelService.validateImport(body.fileId, body.entityType) };
  }

  @Get('template')
  async getTemplate(@Query('entity') entity: string) {
    return { success: true, data: await this.excelService.generateTemplate(entity) };
  }
}

import { Module } from '@nestjs/common';
import { ExcelController } from './controllers/excel.controller';
import { ExcelService } from './services/excel.service';

@Module({
  controllers: [ExcelController],
  providers: [ExcelService],
  exports: [ExcelService]
})
export class ExcelModule {}

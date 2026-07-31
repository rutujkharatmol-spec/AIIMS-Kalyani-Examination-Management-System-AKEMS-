import { Module } from '@nestjs/common';
import { MarksheetController } from './controllers/marksheet.controller';
import { MarksheetService } from './services/marksheet.service';

@Module({
  controllers: [MarksheetController],
  providers: [MarksheetService]
})
export class MarksheetModule {}

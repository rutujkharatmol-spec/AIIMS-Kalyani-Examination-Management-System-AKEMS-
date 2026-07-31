import { Controller, Get, Query } from '@nestjs/common';
import { BarcodeService } from '../services/barcode.service';

@Controller('barcodes')
export class BarcodeController {
  constructor(private readonly barcodeService: BarcodeService) {}

  @Get('generate')
  async generate(@Query('text') text: string, @Query('type') type: string) {
    if (type === 'qr') {
      return this.barcodeService.generateQR(text);
    }
    return this.barcodeService.generateCode128(text);
  }
}

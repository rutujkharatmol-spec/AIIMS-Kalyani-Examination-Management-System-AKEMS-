import { Injectable } from '@nestjs/common';

@Injectable()
export class BarcodeService {
  async generateCode128(text: string) {
    return { type: 'code128', data: `mock_barcode_base64_for_${text}` };
  }
  
  async generateQR(text: string) {
    return { type: 'qr', data: `mock_qr_base64_for_${text}` };
  }
}

import { BarcodeService } from '../services/barcode.service';
export declare class BarcodeController {
    private readonly barcodeService;
    constructor(barcodeService: BarcodeService);
    generate(text: string, type: string): Promise<{
        type: string;
        data: string;
    }>;
}

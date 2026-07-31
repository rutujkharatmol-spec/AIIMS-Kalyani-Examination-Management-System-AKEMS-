export declare class BarcodeService {
    generateCode128(text: string): Promise<{
        type: string;
        data: string;
    }>;
    generateQR(text: string): Promise<{
        type: string;
        data: string;
    }>;
}

export declare class AnswerSheetService {
    registerScannedSheet(barcode: string, pdfPath: string): Promise<{
        success: boolean;
        dummyNumber: string;
        status: string;
    }>;
}

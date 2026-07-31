import { ExcelService } from '../services/excel.service';
export declare class ExcelController {
    private readonly excelService;
    constructor(excelService: ExcelService);
    validateImport(body: any): Promise<{
        success: boolean;
        data: {
            validRows: number;
            errorRows: number;
            errors: {
                row: number;
                message: string;
            }[];
        };
    }>;
    getTemplate(entity: string): Promise<{
        success: boolean;
        data: {
            fileId: string;
            downloadUrl: string;
        };
    }>;
}

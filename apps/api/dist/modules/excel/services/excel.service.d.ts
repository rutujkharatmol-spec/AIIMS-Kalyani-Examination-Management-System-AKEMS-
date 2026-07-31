export declare class ExcelService {
    validateImport(fileId: string, entityType: string): Promise<{
        validRows: number;
        errorRows: number;
        errors: {
            row: number;
            message: string;
        }[];
    }>;
    generateTemplate(entityType: string): Promise<{
        fileId: string;
        downloadUrl: string;
    }>;
}

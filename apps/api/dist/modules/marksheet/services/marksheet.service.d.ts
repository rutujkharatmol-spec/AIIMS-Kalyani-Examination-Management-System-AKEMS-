export declare class MarksheetService {
    generateMarksheet(studentId: string, examCycleId: string): Promise<{
        success: boolean;
        url: string;
    }>;
}

export declare class ReEvaluationService {
    submitRequest(studentId: string, answerSheetId: string, reason: string): Promise<{
        success: boolean;
        requestId: string;
        status: string;
    }>;
}

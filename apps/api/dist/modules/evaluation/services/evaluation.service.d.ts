export declare class EvaluationService {
    allocateSheet(answerSheetId: string, evaluatorId: string): Promise<{
        success: boolean;
        status: string;
    }>;
}

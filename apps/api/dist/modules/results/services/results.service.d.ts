export declare class ResultsService {
    computeResults(examCycleId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    publishResults(examCycleId: string): Promise<{
        success: boolean;
        message: string;
    }>;
}

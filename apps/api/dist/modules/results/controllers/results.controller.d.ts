import { ResultsService } from '../services/results.service';
export declare class ResultsController {
    private readonly resultsService;
    constructor(resultsService: ResultsService);
    compute(examCycleId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    publish(examCycleId: string): Promise<{
        success: boolean;
        message: string;
    }>;
}

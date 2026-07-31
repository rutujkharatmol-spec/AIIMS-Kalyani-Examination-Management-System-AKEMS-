import { ReEvaluationService } from '../services/re-evaluation.service';
export declare class ReEvaluationController {
    private readonly reEvaluationService;
    constructor(reEvaluationService: ReEvaluationService);
    requestReEvaluation(body: any): Promise<{
        success: boolean;
        requestId: string;
        status: string;
    }>;
}

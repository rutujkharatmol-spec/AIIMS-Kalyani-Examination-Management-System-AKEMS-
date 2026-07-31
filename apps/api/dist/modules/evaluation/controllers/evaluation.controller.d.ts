import { EvaluationService } from '../services/evaluation.service';
export declare class EvaluationController {
    private readonly evaluationService;
    constructor(evaluationService: EvaluationService);
    allocate(body: any): Promise<{
        success: boolean;
        status: string;
    }>;
}

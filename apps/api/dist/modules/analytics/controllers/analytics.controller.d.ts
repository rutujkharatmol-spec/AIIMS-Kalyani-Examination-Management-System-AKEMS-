import { AnalyticsService } from '../services/analytics.service';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getDashboard(): Promise<{
        passPercentage: number;
        totalEvaluationsPending: number;
        difficultSubjects: string[];
    }>;
}

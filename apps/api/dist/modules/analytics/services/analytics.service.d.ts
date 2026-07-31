export declare class AnalyticsService {
    getDeanDashboardMetrics(): Promise<{
        passPercentage: number;
        totalEvaluationsPending: number;
        difficultSubjects: string[];
    }>;
}

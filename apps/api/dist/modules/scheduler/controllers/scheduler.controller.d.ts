import { SchedulerService } from '../services/scheduler.service';
export declare class SchedulerController {
    private readonly schedulerService;
    constructor(schedulerService: SchedulerService);
    getStatus(): Promise<{
        success: boolean;
        data: {
            name: string;
            nextRun: string;
            status: string;
        }[];
    }>;
}

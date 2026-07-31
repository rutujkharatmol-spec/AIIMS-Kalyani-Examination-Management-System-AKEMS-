export declare class SchedulerService {
    getStatus(): Promise<{
        name: string;
        nextRun: string;
        status: string;
    }[]>;
}

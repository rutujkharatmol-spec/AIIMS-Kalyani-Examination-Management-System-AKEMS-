export declare class CronJob {
    id: string;
    name: string;
    cron_expression: string;
    is_active: boolean;
    last_run_at: Date;
    last_run_status: string;
}

export declare class AuditService {
    getRecentLogs(limit: number): Promise<{
        id: string;
        action: string;
        resource_type: string;
        created_at: string;
        user_id: string;
    }[]>;
}

import { AuditService } from '../services/audit.service';
export declare class AuditController {
    private readonly auditService;
    constructor(auditService: AuditService);
    getLogs(limit?: number): Promise<{
        success: boolean;
        data: {
            id: string;
            action: string;
            resource_type: string;
            created_at: string;
            user_id: string;
        }[];
        timestamp: string;
    }>;
}

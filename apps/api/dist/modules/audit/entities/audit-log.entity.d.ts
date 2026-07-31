export declare class AuditLog {
    id: string;
    user_id: string;
    action: string;
    resource_type: string;
    resource_id: string;
    old_value: any;
    new_value: any;
    ip_address: string;
    user_agent: string;
    reason: string;
    created_at: Date;
}

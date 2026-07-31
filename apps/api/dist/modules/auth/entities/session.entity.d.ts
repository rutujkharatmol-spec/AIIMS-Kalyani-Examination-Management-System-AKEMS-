export declare class Session {
    id: string;
    user_id: string;
    refresh_token_hash: string;
    ip_address: string;
    user_agent: string;
    expires_at: Date;
    is_revoked: boolean;
    created_at: Date;
}

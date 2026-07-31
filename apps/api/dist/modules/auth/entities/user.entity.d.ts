export declare class User {
    id: string;
    email: string;
    password_hash: string;
    first_name: string;
    last_name: string;
    is_active: boolean;
    is_locked: boolean;
    failed_login_attempts: number;
    last_login_at: Date;
    created_at: Date;
    updated_at: Date;
}

export declare class UsersController {
    findAll(): Promise<{
        success: boolean;
        data: {
            id: string;
            name: string;
            role: string;
            status: string;
        }[];
        timestamp: string;
    }>;
}

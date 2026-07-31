export declare class ConfigMgmtService {
    private configs;
    findAll(category?: string): Promise<{
        key: string;
        value: number;
        type: string;
        category: string;
        description: string;
    }[]>;
    update(key: string, value: any): Promise<{
        key: string;
        value: number;
        type: string;
        category: string;
        description: string;
    }>;
}

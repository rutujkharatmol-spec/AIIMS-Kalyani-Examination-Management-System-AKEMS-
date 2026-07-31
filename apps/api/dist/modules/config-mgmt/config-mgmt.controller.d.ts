import { ConfigMgmtService } from './config-mgmt.service';
export declare class ConfigMgmtController {
    private readonly configService;
    constructor(configService: ConfigMgmtService);
    getConfigs(category: string): Promise<{
        success: boolean;
        data: {
            key: string;
            value: number;
            type: string;
            category: string;
            description: string;
        }[];
        timestamp: string;
    }>;
    updateConfig(key: string, value: any): Promise<{
        success: boolean;
        data: {
            key: string;
            value: number;
            type: string;
            category: string;
            description: string;
        };
        timestamp: string;
    }>;
}

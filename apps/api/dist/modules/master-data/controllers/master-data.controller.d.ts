import { MasterDataService } from '../services/master-data.service';
export declare class MasterDataController {
    private readonly masterDataService;
    constructor(masterDataService: MasterDataService);
    getDepartments(): Promise<{
        success: boolean;
        data: {
            id: string;
            name: string;
            code: string;
        }[];
    }>;
}

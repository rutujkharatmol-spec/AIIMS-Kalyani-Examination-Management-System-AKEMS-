export declare class MasterDataService {
    getDepartments(): Promise<{
        id: string;
        name: string;
        code: string;
    }[]>;
}

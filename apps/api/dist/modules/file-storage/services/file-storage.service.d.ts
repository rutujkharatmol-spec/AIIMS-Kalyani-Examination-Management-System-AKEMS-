export declare class FileStorageService {
    getStorageStats(): Promise<{
        totalUsedBytes: number;
        totalFiles: number;
    }>;
}

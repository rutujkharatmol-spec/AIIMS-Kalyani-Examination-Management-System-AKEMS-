import { FileStorageService } from '../services/file-storage.service';
export declare class FileStorageController {
    private readonly fileStorageService;
    constructor(fileStorageService: FileStorageService);
    uploadFile(): Promise<{
        success: boolean;
        data: {
            id: string;
        };
    }>;
    downloadFile(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}

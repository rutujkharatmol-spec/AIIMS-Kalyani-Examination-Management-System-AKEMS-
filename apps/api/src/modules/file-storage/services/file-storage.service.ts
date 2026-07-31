import { Injectable } from '@nestjs/common';

@Injectable()
export class FileStorageService {
  async getStorageStats() {
    return { totalUsedBytes: 1542000000, totalFiles: 843 };
  }
}

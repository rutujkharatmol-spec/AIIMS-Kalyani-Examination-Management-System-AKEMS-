import { Controller, Post, Get, Param } from '@nestjs/common';
import { FileStorageService } from '../services/file-storage.service';

@Controller('files')
export class FileStorageController {
  constructor(private readonly fileStorageService: FileStorageService) {}

  @Post('upload')
  async uploadFile() {
    return { success: true, data: { id: 'mock-file-id' } };
  }

  @Get(':id/download')
  async downloadFile(@Param('id') id: string) {
    return { success: true, message: 'Stream file from storage provider' };
  }
}

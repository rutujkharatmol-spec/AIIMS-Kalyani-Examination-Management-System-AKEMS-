import { Injectable } from '@nestjs/common';

@Injectable()
export class SchedulerService {
  async getStatus() {
    return [
      { name: 'nightly_backup', nextRun: '02:00 AM', status: 'ACTIVE' },
      { name: 'temp_file_cleanup', nextRun: '03:00 AM', status: 'ACTIVE' }
    ];
  }
}

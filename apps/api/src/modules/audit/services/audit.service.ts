import { Injectable } from '@nestjs/common';

@Injectable()
export class AuditService {
  async getRecentLogs(limit: number) {
    // Mock audit logs
    return [
      { id: 'uuid-1', action: 'UPDATE', resource_type: 'USER', created_at: new Date().toISOString(), user_id: 'dean-id' },
      { id: 'uuid-2', action: 'UPDATE', resource_type: 'CONFIG', created_at: new Date(Date.now() - 3600000).toISOString(), user_id: 'admin-id' }
    ];
  }
}

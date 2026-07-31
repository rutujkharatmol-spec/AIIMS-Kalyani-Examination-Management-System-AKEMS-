import { Injectable } from '@nestjs/common';

@Injectable()
export class DashboardService {
  async getWidgets() {
    return [
      {
        id: 'system-health',
        title: 'System Health',
        type: 'status',
        payload: {
          items: [
            { label: 'Database', status: 'ok', iconName: 'Database' },
            { label: 'Redis Cache', status: 'ok', iconName: 'Server' }
          ]
        }
      },
      {
        id: 'active-users',
        title: 'Active Users',
        type: 'stat',
        payload: {
          label: 'Total Active Users',
          value: 124,
          iconName: 'Users',
          change: { value: '12%', direction: 'up', period: 'last week' }
        }
      },
      {
        id: 'storage-usage',
        title: 'Storage Usage',
        type: 'stat',
        payload: {
          label: 'Used (GB)',
          value: '1.5',
          iconName: 'HardDrive',
          change: { value: '0.1%', direction: 'up', period: 'last month' }
        }
      },
      {
        id: 'pending-approvals',
        title: 'Pending Approvals',
        type: 'stat',
        payload: {
          label: 'Requires your review',
          value: 3,
          iconName: 'Clock'
        }
      }
    ];
  }
}

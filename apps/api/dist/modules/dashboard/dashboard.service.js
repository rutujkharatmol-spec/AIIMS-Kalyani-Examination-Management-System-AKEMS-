"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
let DashboardService = class DashboardService {
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
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)()
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map
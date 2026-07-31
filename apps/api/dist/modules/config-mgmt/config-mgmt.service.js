"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigMgmtService = void 0;
const common_1 = require("@nestjs/common");
let ConfigMgmtService = class ConfigMgmtService {
    // In-memory mock until database is fully connected
    configs = [
        { key: 'hallTicketReleaseDays', value: 7, type: 'number', category: 'Examination', description: 'Days before exam to release hall ticket' },
        { key: 'maxReEvaluationAttempts', value: 2, type: 'number', category: 'Examination', description: 'Max re-evaluation attempts per subject' },
        { key: 'passwordMinLength', value: 8, type: 'number', category: 'Authentication', description: 'Minimum length for passwords' }
    ];
    async findAll(category) {
        if (category) {
            return this.configs.filter(c => c.category === category);
        }
        return this.configs;
    }
    async update(key, value) {
        const index = this.configs.findIndex(c => c.key === key);
        if (index === -1) {
            throw new common_1.NotFoundException(`Config key ${key} not found`);
        }
        this.configs[index].value = value;
        return this.configs[index];
    }
};
exports.ConfigMgmtService = ConfigMgmtService;
exports.ConfigMgmtService = ConfigMgmtService = __decorate([
    (0, common_1.Injectable)()
], ConfigMgmtService);
//# sourceMappingURL=config-mgmt.service.js.map
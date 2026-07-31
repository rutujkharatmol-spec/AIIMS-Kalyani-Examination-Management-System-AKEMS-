"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigMgmtController = void 0;
const common_1 = require("@nestjs/common");
const config_mgmt_service_1 = require("./config-mgmt.service");
let ConfigMgmtController = class ConfigMgmtController {
    configService;
    constructor(configService) {
        this.configService = configService;
    }
    async getConfigs(category) {
        const data = await this.configService.findAll(category);
        return {
            success: true,
            data,
            timestamp: new Date().toISOString(),
        };
    }
    async updateConfig(key, value) {
        const data = await this.configService.update(key, value);
        return {
            success: true,
            data,
            timestamp: new Date().toISOString(),
        };
    }
};
exports.ConfigMgmtController = ConfigMgmtController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConfigMgmtController.prototype, "getConfigs", null);
__decorate([
    (0, common_1.Patch)(':key'),
    __param(0, (0, common_1.Param)('key')),
    __param(1, (0, common_1.Body)('value')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ConfigMgmtController.prototype, "updateConfig", null);
exports.ConfigMgmtController = ConfigMgmtController = __decorate([
    (0, common_1.Controller)('config'),
    __metadata("design:paramtypes", [config_mgmt_service_1.ConfigMgmtService])
], ConfigMgmtController);
//# sourceMappingURL=config-mgmt.controller.js.map
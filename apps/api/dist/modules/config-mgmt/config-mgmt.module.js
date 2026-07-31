"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigMgmtModule = void 0;
const common_1 = require("@nestjs/common");
const config_mgmt_controller_1 = require("./config-mgmt.controller");
const config_mgmt_service_1 = require("./config-mgmt.service");
let ConfigMgmtModule = class ConfigMgmtModule {
};
exports.ConfigMgmtModule = ConfigMgmtModule;
exports.ConfigMgmtModule = ConfigMgmtModule = __decorate([
    (0, common_1.Module)({
        controllers: [config_mgmt_controller_1.ConfigMgmtController],
        providers: [config_mgmt_service_1.ConfigMgmtService],
    })
], ConfigMgmtModule);
//# sourceMappingURL=config-mgmt.module.js.map
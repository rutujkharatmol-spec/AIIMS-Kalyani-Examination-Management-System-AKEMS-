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
exports.FileStorageController = void 0;
const common_1 = require("@nestjs/common");
const file_storage_service_1 = require("../services/file-storage.service");
let FileStorageController = class FileStorageController {
    fileStorageService;
    constructor(fileStorageService) {
        this.fileStorageService = fileStorageService;
    }
    async uploadFile() {
        return { success: true, data: { id: 'mock-file-id' } };
    }
    async downloadFile(id) {
        return { success: true, message: 'Stream file from storage provider' };
    }
};
exports.FileStorageController = FileStorageController;
__decorate([
    (0, common_1.Post)('upload'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FileStorageController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Get)(':id/download'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FileStorageController.prototype, "downloadFile", null);
exports.FileStorageController = FileStorageController = __decorate([
    (0, common_1.Controller)('files'),
    __metadata("design:paramtypes", [file_storage_service_1.FileStorageService])
], FileStorageController);
//# sourceMappingURL=file-storage.controller.js.map
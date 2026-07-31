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
exports.MarksheetController = void 0;
const common_1 = require("@nestjs/common");
const marksheet_service_1 = require("../services/marksheet.service");
let MarksheetController = class MarksheetController {
    marksheetService;
    constructor(marksheetService) {
        this.marksheetService = marksheetService;
    }
    async generate(body) {
        return this.marksheetService.generateMarksheet(body.studentId, body.examCycleId);
    }
};
exports.MarksheetController = MarksheetController;
__decorate([
    (0, common_1.Post)('generate'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MarksheetController.prototype, "generate", null);
exports.MarksheetController = MarksheetController = __decorate([
    (0, common_1.Controller)('marksheets'),
    __metadata("design:paramtypes", [marksheet_service_1.MarksheetService])
], MarksheetController);
//# sourceMappingURL=marksheet.controller.js.map
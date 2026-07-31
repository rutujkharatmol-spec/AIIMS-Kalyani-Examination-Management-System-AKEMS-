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
exports.ResultsController = void 0;
const common_1 = require("@nestjs/common");
const results_service_1 = require("../services/results.service");
let ResultsController = class ResultsController {
    resultsService;
    constructor(resultsService) {
        this.resultsService = resultsService;
    }
    async compute(examCycleId) {
        return this.resultsService.computeResults(examCycleId);
    }
    async publish(examCycleId) {
        return this.resultsService.publishResults(examCycleId);
    }
};
exports.ResultsController = ResultsController;
__decorate([
    (0, common_1.Post)('compute/:examCycleId'),
    __param(0, (0, common_1.Param)('examCycleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ResultsController.prototype, "compute", null);
__decorate([
    (0, common_1.Post)('publish/:examCycleId'),
    __param(0, (0, common_1.Param)('examCycleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ResultsController.prototype, "publish", null);
exports.ResultsController = ResultsController = __decorate([
    (0, common_1.Controller)('results'),
    __metadata("design:paramtypes", [results_service_1.ResultsService])
], ResultsController);
//# sourceMappingURL=results.controller.js.map
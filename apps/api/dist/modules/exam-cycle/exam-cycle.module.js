"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamCycleModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const exam_cycle_controller_1 = require("./controllers/exam-cycle.controller");
const exam_cycle_service_1 = require("./services/exam-cycle.service");
const exam_cycle_entity_1 = require("./entities/exam-cycle.entity");
let ExamCycleModule = class ExamCycleModule {
};
exports.ExamCycleModule = ExamCycleModule;
exports.ExamCycleModule = ExamCycleModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([exam_cycle_entity_1.ExamCycle])],
        controllers: [exam_cycle_controller_1.ExamCycleController],
        providers: [exam_cycle_service_1.ExamCycleService]
    })
], ExamCycleModule);
//# sourceMappingURL=exam-cycle.module.js.map
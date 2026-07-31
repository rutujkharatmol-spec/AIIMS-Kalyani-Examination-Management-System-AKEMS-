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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamCycle = void 0;
const typeorm_1 = require("typeorm");
let ExamCycle = class ExamCycle {
    id;
    name;
    start_date;
    end_date;
    status;
    created_at;
};
exports.ExamCycle = ExamCycle;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ExamCycle.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ExamCycle.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)('date'),
    __metadata("design:type", Date)
], ExamCycle.prototype, "start_date", void 0);
__decorate([
    (0, typeorm_1.Column)('date'),
    __metadata("design:type", Date)
], ExamCycle.prototype, "end_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'DRAFT' }),
    __metadata("design:type", String)
], ExamCycle.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ExamCycle.prototype, "created_at", void 0);
exports.ExamCycle = ExamCycle = __decorate([
    (0, typeorm_1.Entity)('exam_cycles')
], ExamCycle);
//# sourceMappingURL=exam-cycle.entity.js.map
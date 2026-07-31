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
exports.ExamSchedule = void 0;
const typeorm_1 = require("typeorm");
let ExamSchedule = class ExamSchedule {
    id;
    exam_cycle_id;
    subject_id;
    exam_date;
    start_time;
    end_time;
    type;
    is_published;
};
exports.ExamSchedule = ExamSchedule;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ExamSchedule.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], ExamSchedule.prototype, "exam_cycle_id", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], ExamSchedule.prototype, "subject_id", void 0);
__decorate([
    (0, typeorm_1.Column)('date'),
    __metadata("design:type", Date)
], ExamSchedule.prototype, "exam_date", void 0);
__decorate([
    (0, typeorm_1.Column)('time'),
    __metadata("design:type", String)
], ExamSchedule.prototype, "start_time", void 0);
__decorate([
    (0, typeorm_1.Column)('time'),
    __metadata("design:type", String)
], ExamSchedule.prototype, "end_time", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ExamSchedule.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], ExamSchedule.prototype, "is_published", void 0);
exports.ExamSchedule = ExamSchedule = __decorate([
    (0, typeorm_1.Entity)('exam_schedules')
], ExamSchedule);
//# sourceMappingURL=exam-schedule.entity.js.map
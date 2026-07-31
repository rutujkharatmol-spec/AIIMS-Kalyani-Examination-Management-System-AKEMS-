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
exports.AttendanceRecord = void 0;
const typeorm_1 = require("typeorm");
let AttendanceRecord = class AttendanceRecord {
    id;
    schedule_id;
    student_id;
    room_id;
    invigilator_id;
    answer_sheet_barcode;
    status; // PRESENT, ABSENT, MALPRACTICE
    scanned_at;
};
exports.AttendanceRecord = AttendanceRecord;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AttendanceRecord.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], AttendanceRecord.prototype, "schedule_id", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], AttendanceRecord.prototype, "student_id", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], AttendanceRecord.prototype, "room_id", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], AttendanceRecord.prototype, "invigilator_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AttendanceRecord.prototype, "answer_sheet_barcode", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'PRESENT' }),
    __metadata("design:type", String)
], AttendanceRecord.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], AttendanceRecord.prototype, "scanned_at", void 0);
exports.AttendanceRecord = AttendanceRecord = __decorate([
    (0, typeorm_1.Entity)('attendance_records')
], AttendanceRecord);
//# sourceMappingURL=attendance.entity.js.map
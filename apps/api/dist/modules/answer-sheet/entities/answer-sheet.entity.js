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
exports.AnswerSheet = void 0;
const typeorm_1 = require("typeorm");
let AnswerSheet = class AnswerSheet {
    id;
    exam_schedule_id;
    original_barcode;
    dummy_number;
    student_id;
    pdf_path;
    status;
    collected_at;
};
exports.AnswerSheet = AnswerSheet;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AnswerSheet.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], AnswerSheet.prototype, "exam_schedule_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AnswerSheet.prototype, "original_barcode", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], AnswerSheet.prototype, "dummy_number", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], AnswerSheet.prototype, "student_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AnswerSheet.prototype, "pdf_path", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'COLLECTED' }),
    __metadata("design:type", String)
], AnswerSheet.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], AnswerSheet.prototype, "collected_at", void 0);
exports.AnswerSheet = AnswerSheet = __decorate([
    (0, typeorm_1.Entity)('answer_sheets')
], AnswerSheet);
//# sourceMappingURL=answer-sheet.entity.js.map
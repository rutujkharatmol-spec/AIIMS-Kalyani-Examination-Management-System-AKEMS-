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
exports.QuestionPaper = void 0;
const typeorm_1 = require("typeorm");
let QuestionPaper = class QuestionPaper {
    id;
    subject_id;
    exam_cycle_id;
    total_marks;
    blueprint;
    status;
    workflow_instance_id;
    encrypted_file_path;
    created_at;
};
exports.QuestionPaper = QuestionPaper;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], QuestionPaper.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], QuestionPaper.prototype, "subject_id", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], QuestionPaper.prototype, "exam_cycle_id", void 0);
__decorate([
    (0, typeorm_1.Column)('int'),
    __metadata("design:type", Number)
], QuestionPaper.prototype, "total_marks", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb'),
    __metadata("design:type", Object)
], QuestionPaper.prototype, "blueprint", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'DRAFT' }),
    __metadata("design:type", String)
], QuestionPaper.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid', { nullable: true }),
    __metadata("design:type", String)
], QuestionPaper.prototype, "workflow_instance_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], QuestionPaper.prototype, "encrypted_file_path", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], QuestionPaper.prototype, "created_at", void 0);
exports.QuestionPaper = QuestionPaper = __decorate([
    (0, typeorm_1.Entity)('question_papers')
], QuestionPaper);
//# sourceMappingURL=question-paper.entity.js.map
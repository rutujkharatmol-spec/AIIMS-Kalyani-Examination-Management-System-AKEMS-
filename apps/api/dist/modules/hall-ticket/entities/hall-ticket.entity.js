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
exports.HallTicket = void 0;
const typeorm_1 = require("typeorm");
let HallTicket = class HallTicket {
    id;
    student_id;
    exam_cycle_id;
    barcode;
    status;
    pdf_path;
    created_at;
};
exports.HallTicket = HallTicket;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], HallTicket.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], HallTicket.prototype, "student_id", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], HallTicket.prototype, "exam_cycle_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], HallTicket.prototype, "barcode", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'GENERATED' }),
    __metadata("design:type", String)
], HallTicket.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], HallTicket.prototype, "pdf_path", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], HallTicket.prototype, "created_at", void 0);
exports.HallTicket = HallTicket = __decorate([
    (0, typeorm_1.Entity)('hall_tickets')
], HallTicket);
//# sourceMappingURL=hall-ticket.entity.js.map
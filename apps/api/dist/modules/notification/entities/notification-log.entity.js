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
exports.NotificationLog = void 0;
const typeorm_1 = require("typeorm");
let NotificationLog = class NotificationLog {
    id;
    user_id;
    channel;
    status;
    payload;
    error_reason;
    created_at;
};
exports.NotificationLog = NotificationLog;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], NotificationLog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid', { nullable: true }),
    __metadata("design:type", String)
], NotificationLog.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], NotificationLog.prototype, "channel", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'PENDING' }),
    __metadata("design:type", String)
], NotificationLog.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], NotificationLog.prototype, "payload", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], NotificationLog.prototype, "error_reason", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], NotificationLog.prototype, "created_at", void 0);
exports.NotificationLog = NotificationLog = __decorate([
    (0, typeorm_1.Entity)('notification_logs')
], NotificationLog);
//# sourceMappingURL=notification-log.entity.js.map
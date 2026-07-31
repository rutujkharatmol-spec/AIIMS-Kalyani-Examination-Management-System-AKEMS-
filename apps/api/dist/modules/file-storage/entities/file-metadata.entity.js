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
exports.FileMetadata = void 0;
const typeorm_1 = require("typeorm");
let FileMetadata = class FileMetadata {
    id;
    original_name;
    mime_type;
    size_bytes;
    storage_path;
    file_hash;
    uploaded_by;
    scan_status; // PENDING, CLEAN, INFECTED
    created_at;
};
exports.FileMetadata = FileMetadata;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], FileMetadata.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], FileMetadata.prototype, "original_name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], FileMetadata.prototype, "mime_type", void 0);
__decorate([
    (0, typeorm_1.Column)('int'),
    __metadata("design:type", Number)
], FileMetadata.prototype, "size_bytes", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], FileMetadata.prototype, "storage_path", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], FileMetadata.prototype, "file_hash", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], FileMetadata.prototype, "uploaded_by", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'PENDING' }),
    __metadata("design:type", String)
], FileMetadata.prototype, "scan_status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], FileMetadata.prototype, "created_at", void 0);
exports.FileMetadata = FileMetadata = __decorate([
    (0, typeorm_1.Entity)('file_metadata')
], FileMetadata);
//# sourceMappingURL=file-metadata.entity.js.map
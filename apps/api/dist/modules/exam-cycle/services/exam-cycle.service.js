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
exports.ExamCycleService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const exam_cycle_entity_1 = require("../entities/exam-cycle.entity");
let ExamCycleService = class ExamCycleService {
    examCycleRepository;
    constructor(examCycleRepository) {
        this.examCycleRepository = examCycleRepository;
    }
    async findAll() {
        const cycles = await this.examCycleRepository.find({ order: { start_date: 'DESC' } });
        // Fallback mock data if DB is empty
        if (cycles.length === 0) {
            return [
                { id: '1', name: 'MBBS 2024 1st Professional', start_date: '2024-05-01', end_date: '2024-05-15', status: 'COMPLETED' },
                { id: '2', name: 'B.Sc Nursing 3rd Year Final', start_date: '2024-11-10', end_date: '2024-11-20', status: 'ACTIVE' },
                { id: '3', name: 'MD General Medicine Part I', start_date: '2025-01-05', end_date: '2025-01-12', status: 'UPCOMING' },
                { id: '4', name: 'MBBS 2025 2nd Professional', start_date: '2025-06-01', end_date: '2025-06-15', status: 'DRAFT' }
            ];
        }
        return cycles;
    }
};
exports.ExamCycleService = ExamCycleService;
exports.ExamCycleService = ExamCycleService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(exam_cycle_entity_1.ExamCycle)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ExamCycleService);
//# sourceMappingURL=exam-cycle.service.js.map
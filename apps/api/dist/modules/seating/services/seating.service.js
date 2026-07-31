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
exports.SeatingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const seating_arrangement_entity_1 = require("../entities/seating-arrangement.entity");
let SeatingService = class SeatingService {
    seatingRepository;
    constructor(seatingRepository) {
        this.seatingRepository = seatingRepository;
    }
    async autoAllocate(examCycleId) {
        // In a real scenario, this would query Students, query Rooms, and distribute them.
        // For this prototype, we simulate a successful allocation and return mock structured data.
        return {
            success: true,
            message: 'Successfully allocated 120 students across 3 rooms.',
        };
    }
    async getArrangements(examCycleId) {
        // Return mock data for the frontend dashboard
        return [
            {
                roomId: 'room-1',
                roomNumber: 'Lecture Hall 1',
                capacity: 50,
                allocatedCount: 50,
                students: ['MBBS24001', 'MBBS24002', 'MBBS24003', 'MBBS24004', 'MBBS24005'] // sample
            },
            {
                roomId: 'room-2',
                roomNumber: 'Lecture Hall 2',
                capacity: 50,
                allocatedCount: 45,
                students: ['MBBS24006', 'MBBS24007', 'MBBS24008', 'MBBS24009', 'MBBS24010'] // sample
            },
            {
                roomId: 'room-3',
                roomNumber: 'Auditorium A',
                capacity: 100,
                allocatedCount: 25,
                students: ['MBBS24011', 'MBBS24012', 'MBBS24013'] // sample
            }
        ];
    }
};
exports.SeatingService = SeatingService;
exports.SeatingService = SeatingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(seating_arrangement_entity_1.SeatingArrangement)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SeatingService);
//# sourceMappingURL=seating.service.js.map
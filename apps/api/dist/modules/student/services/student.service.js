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
exports.StudentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const student_entity_1 = require("../entities/student.entity");
let StudentService = class StudentService {
    studentRepository;
    constructor(studentRepository) {
        this.studentRepository = studentRepository;
    }
    async findAll() {
        const students = await this.studentRepository.find();
        // Fallback mock data if DB is empty for demo purposes
        if (students.length === 0) {
            return [
                { id: '1', roll_number: 'MBBS24001', name: 'Aarav Patel', email: 'aarav@aiimskalyani.edu.in', course: 'MBBS', semester: 2, status: 'ACTIVE' },
                { id: '2', roll_number: 'MBBS24002', name: 'Priya Sharma', email: 'priya@aiimskalyani.edu.in', course: 'MBBS', semester: 2, status: 'ACTIVE' },
                { id: '3', roll_number: 'NURS24015', name: 'Rohan Kumar', email: 'rohan@aiimskalyani.edu.in', course: 'B.Sc Nursing', semester: 1, status: 'INACTIVE' },
                { id: '4', roll_number: 'MBBS24003', name: 'Ananya Singh', email: 'ananya@aiimskalyani.edu.in', course: 'MBBS', semester: 2, status: 'ACTIVE' },
                { id: '5', roll_number: 'PG24055', name: 'Dr. Vikram Das', email: 'vikram@aiimskalyani.edu.in', course: 'MD General Medicine', semester: 4, status: 'ACTIVE' }
            ];
        }
        return students;
    }
};
exports.StudentService = StudentService;
exports.StudentService = StudentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(student_entity_1.StudentProfile)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], StudentService);
//# sourceMappingURL=student.service.js.map
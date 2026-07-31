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
exports.QuestionBankController = void 0;
const common_1 = require("@nestjs/common");
const question_bank_service_1 = require("../services/question-bank.service");
let QuestionBankController = class QuestionBankController {
    questionBankService;
    constructor(questionBankService) {
        this.questionBankService = questionBankService;
    }
    async getQuestions(id) {
        return { success: true, data: await this.questionBankService.getQuestionsBySubject(id) };
    }
};
exports.QuestionBankController = QuestionBankController;
__decorate([
    (0, common_1.Get)('subject/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QuestionBankController.prototype, "getQuestions", null);
exports.QuestionBankController = QuestionBankController = __decorate([
    (0, common_1.Controller)('question-bank'),
    __metadata("design:paramtypes", [question_bank_service_1.QuestionBankService])
], QuestionBankController);
//# sourceMappingURL=question-bank.controller.js.map
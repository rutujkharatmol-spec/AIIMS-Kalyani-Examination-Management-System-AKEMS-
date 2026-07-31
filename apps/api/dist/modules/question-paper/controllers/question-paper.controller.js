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
exports.QuestionPaperController = void 0;
const common_1 = require("@nestjs/common");
const question_paper_service_1 = require("../services/question-paper.service");
let QuestionPaperController = class QuestionPaperController {
    questionPaperService;
    constructor(questionPaperService) {
        this.questionPaperService = questionPaperService;
    }
    async generate(body) {
        return this.questionPaperService.generateFromBlueprint(body.subjectId, body.blueprint);
    }
};
exports.QuestionPaperController = QuestionPaperController;
__decorate([
    (0, common_1.Post)('generate'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QuestionPaperController.prototype, "generate", null);
exports.QuestionPaperController = QuestionPaperController = __decorate([
    (0, common_1.Controller)('question-papers'),
    __metadata("design:paramtypes", [question_paper_service_1.QuestionPaperService])
], QuestionPaperController);
//# sourceMappingURL=question-paper.controller.js.map
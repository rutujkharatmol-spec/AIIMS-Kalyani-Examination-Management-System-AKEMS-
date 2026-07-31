"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionPaperModule = void 0;
const common_1 = require("@nestjs/common");
const question_paper_controller_1 = require("./controllers/question-paper.controller");
const question_paper_service_1 = require("./services/question-paper.service");
let QuestionPaperModule = class QuestionPaperModule {
};
exports.QuestionPaperModule = QuestionPaperModule;
exports.QuestionPaperModule = QuestionPaperModule = __decorate([
    (0, common_1.Module)({
        controllers: [question_paper_controller_1.QuestionPaperController],
        providers: [question_paper_service_1.QuestionPaperService]
    })
], QuestionPaperModule);
//# sourceMappingURL=question-paper.module.js.map
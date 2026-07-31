import { QuestionPaperService } from '../services/question-paper.service';
export declare class QuestionPaperController {
    private readonly questionPaperService;
    constructor(questionPaperService: QuestionPaperService);
    generate(body: any): Promise<{
        success: boolean;
        paperId: string;
        status: string;
    }>;
}

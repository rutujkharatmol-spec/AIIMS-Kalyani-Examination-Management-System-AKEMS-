import { QuestionBankService } from '../services/question-bank.service';
export declare class QuestionBankController {
    private readonly questionBankService;
    constructor(questionBankService: QuestionBankService);
    getQuestions(id: string): Promise<{
        success: boolean;
        data: {
            id: string;
            text: string;
            type: string;
            status: string;
        }[];
    }>;
}

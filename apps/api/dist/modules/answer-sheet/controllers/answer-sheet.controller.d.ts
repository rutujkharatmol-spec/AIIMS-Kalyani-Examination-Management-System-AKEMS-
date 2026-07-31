import { AnswerSheetService } from '../services/answer-sheet.service';
export declare class AnswerSheetController {
    private readonly answerSheetService;
    constructor(answerSheetService: AnswerSheetService);
    scanSheet(body: any): Promise<{
        success: boolean;
        dummyNumber: string;
        status: string;
    }>;
}

export declare class QuestionBankService {
    getQuestionsBySubject(subjectId: string): Promise<{
        id: string;
        text: string;
        type: string;
        status: string;
    }[]>;
}

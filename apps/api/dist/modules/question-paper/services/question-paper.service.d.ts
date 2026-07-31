export declare class QuestionPaperService {
    generateFromBlueprint(subjectId: string, blueprint: any): Promise<{
        success: boolean;
        paperId: string;
        status: string;
    }>;
}

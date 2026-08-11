import { ExamCycleService } from '../services/exam-cycle.service';
export declare class ExamCycleController {
    private readonly examCycleService;
    constructor(examCycleService: ExamCycleService);
    getExamCycles(): Promise<{
        success: boolean;
        data: import("../entities/exam-cycle.entity").ExamCycle[] | {
            id: string;
            name: string;
            start_date: string;
            end_date: string;
            status: string;
        }[];
    }>;
    createExamCycle(data: any): Promise<{
        success: boolean;
        data: import("../entities/exam-cycle.entity").ExamCycle;
    }>;
    updateExamCycle(id: string, data: any): Promise<{
        success: boolean;
        data: {
            id: string;
            name?: string | undefined;
            start_date?: Date | undefined;
            end_date?: Date | undefined;
            status?: string | undefined;
            created_at?: Date | undefined;
        } | null;
    }>;
    deleteExamCycle(id: string): Promise<{
        success: boolean;
        data: {
            id: string;
        };
    }>;
}

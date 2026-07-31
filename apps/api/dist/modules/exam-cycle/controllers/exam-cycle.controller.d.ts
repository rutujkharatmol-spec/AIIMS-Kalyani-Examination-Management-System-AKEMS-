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
}

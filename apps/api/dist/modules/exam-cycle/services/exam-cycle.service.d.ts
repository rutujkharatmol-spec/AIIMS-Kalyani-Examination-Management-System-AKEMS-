import { Repository } from 'typeorm';
import { ExamCycle } from '../entities/exam-cycle.entity';
export declare class ExamCycleService {
    private examCycleRepository;
    private deletedMockIds;
    constructor(examCycleRepository: Repository<ExamCycle>);
    findAll(): Promise<{
        id: string;
        name: string;
        start_date: string;
        end_date: string;
        status: string;
    }[] | ExamCycle[]>;
    create(data: Partial<ExamCycle>): Promise<ExamCycle>;
    update(id: string, data: Partial<ExamCycle>): Promise<{
        id: string;
        name?: string | undefined;
        start_date?: Date | undefined;
        end_date?: Date | undefined;
        status?: string | undefined;
        created_at?: Date | undefined;
    } | null>;
    remove(id: string): Promise<{
        id: string;
    }>;
}

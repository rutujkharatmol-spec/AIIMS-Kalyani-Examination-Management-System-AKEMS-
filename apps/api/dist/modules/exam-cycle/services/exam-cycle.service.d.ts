import { Repository } from 'typeorm';
import { ExamCycle } from '../entities/exam-cycle.entity';
export declare class ExamCycleService {
    private examCycleRepository;
    constructor(examCycleRepository: Repository<ExamCycle>);
    findAll(): Promise<ExamCycle[] | {
        id: string;
        name: string;
        start_date: string;
        end_date: string;
        status: string;
    }[]>;
}

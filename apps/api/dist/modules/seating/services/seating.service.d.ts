import { Repository } from 'typeorm';
import { SeatingArrangement } from '../entities/seating-arrangement.entity';
export declare class SeatingService {
    private seatingRepository;
    constructor(seatingRepository: Repository<SeatingArrangement>);
    autoAllocate(examCycleId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getArrangements(examCycleId: string): Promise<{
        roomId: string;
        roomNumber: string;
        capacity: number;
        allocatedCount: number;
        students: string[];
    }[]>;
}

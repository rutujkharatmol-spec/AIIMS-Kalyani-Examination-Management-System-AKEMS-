import { SeatingService } from '../services/seating.service';
export declare class SeatingController {
    private readonly seatingService;
    constructor(seatingService: SeatingService);
    autoAllocate(examCycleId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getArrangements(examCycleId: string): Promise<{
        success: boolean;
        data: {
            roomId: string;
            roomNumber: string;
            capacity: number;
            allocatedCount: number;
            students: string[];
        }[];
    }>;
}

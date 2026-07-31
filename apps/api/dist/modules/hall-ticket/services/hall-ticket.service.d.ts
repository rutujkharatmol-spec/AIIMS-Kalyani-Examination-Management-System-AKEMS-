export declare class HallTicketService {
    generateForCycle(examCycleId: string): Promise<{
        success: boolean;
        count: number;
    }>;
}

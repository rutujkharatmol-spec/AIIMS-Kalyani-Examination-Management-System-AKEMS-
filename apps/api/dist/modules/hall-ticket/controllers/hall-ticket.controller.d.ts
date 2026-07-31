import { HallTicketService } from '../services/hall-ticket.service';
export declare class HallTicketController {
    private readonly hallTicketService;
    constructor(hallTicketService: HallTicketService);
    generate(id: string): Promise<{
        success: boolean;
        count: number;
    }>;
}

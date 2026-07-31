import { MarksheetService } from '../services/marksheet.service';
export declare class MarksheetController {
    private readonly marksheetService;
    constructor(marksheetService: MarksheetService);
    generate(body: any): Promise<{
        success: boolean;
        url: string;
    }>;
}

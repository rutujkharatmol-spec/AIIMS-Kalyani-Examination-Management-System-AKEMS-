import { WorkflowService } from '../services/workflow.service';
export declare class WorkflowController {
    private readonly workflowService;
    constructor(workflowService: WorkflowService);
    getPendingApprovals(): Promise<{
        success: boolean;
        data: {
            id: string;
            entity_type: string;
            status: string;
            step: string;
        }[];
    }>;
    approve(id: string, body: any): Promise<{
        success: boolean;
        message: string;
    }>;
}

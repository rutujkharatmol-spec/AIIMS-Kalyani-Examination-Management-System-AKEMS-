export declare class WorkflowService {
    getPendingApprovals(role: string): Promise<{
        id: string;
        entity_type: string;
        status: string;
        step: string;
    }[]>;
}

export declare class NotificationService {
    send(channel: string, payload: any): Promise<{
        success: boolean;
        messageId: string;
    }>;
}

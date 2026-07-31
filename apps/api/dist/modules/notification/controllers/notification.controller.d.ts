import { NotificationService } from '../services/notification.service';
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    sendNotification(body: any): Promise<{
        success: boolean;
        messageId: string;
    }>;
}

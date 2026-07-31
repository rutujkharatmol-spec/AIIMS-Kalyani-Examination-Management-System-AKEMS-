import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationService {
  async send(channel: string, payload: any) {
    // Mock queue dispatch
    console.log(`[Notification] Queued ${channel} notification.`);
    return { success: true, messageId: 'mock-msg-123' };
  }
}

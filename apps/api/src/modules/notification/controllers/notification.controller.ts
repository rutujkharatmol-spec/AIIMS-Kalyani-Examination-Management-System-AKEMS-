import { Controller, Post, Body } from '@nestjs/common';
import { NotificationService } from '../services/notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('send')
  async sendNotification(@Body() body: any) {
    return this.notificationService.send(body.channel, body.payload);
  }
}

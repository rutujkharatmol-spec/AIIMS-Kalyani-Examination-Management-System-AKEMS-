import { Controller, Get } from '@nestjs/common';
import { RoomService } from '../services/room.service';

@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get()
  async getRooms() {
    return { success: true, data: await this.roomService.findAll() };
  }
}

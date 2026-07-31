import { Injectable } from '@nestjs/common';

@Injectable()
export class RoomService {
  async findAll() {
    return [{ id: 'room-1', room_number: '101', exam_capacity: 30, is_exam_centre: true }];
  }
}

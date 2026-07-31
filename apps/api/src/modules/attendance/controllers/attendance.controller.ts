import { Controller, Post, Body } from '@nestjs/common';
import { AttendanceService } from '../services/attendance.service';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('scan')
  async scan(@Body() body: any) {
    return this.attendanceService.recordScan(body.barcode, body.roomId, body.invigilatorId);
  }
}

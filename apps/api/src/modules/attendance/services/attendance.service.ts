import { Injectable } from '@nestjs/common';

@Injectable()
export class AttendanceService {
  async recordScan(barcode: string, roomId: string, invigilatorId: string) {
    return { success: true, status: 'PRESENT', studentId: 'mock-student-1' };
  }
}

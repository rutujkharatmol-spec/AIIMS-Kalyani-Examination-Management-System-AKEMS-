import { AttendanceService } from '../services/attendance.service';
export declare class AttendanceController {
    private readonly attendanceService;
    constructor(attendanceService: AttendanceService);
    scan(body: any): Promise<{
        success: boolean;
        status: string;
        studentId: string;
    }>;
}

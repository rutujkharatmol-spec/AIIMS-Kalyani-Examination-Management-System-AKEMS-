export declare class AttendanceService {
    recordScan(barcode: string, roomId: string, invigilatorId: string): Promise<{
        success: boolean;
        status: string;
        studentId: string;
    }>;
}

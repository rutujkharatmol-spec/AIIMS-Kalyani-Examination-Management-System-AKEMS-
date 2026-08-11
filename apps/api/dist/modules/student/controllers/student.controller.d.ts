import { StudentService } from '../services/student.service';
export declare class StudentController {
    private readonly studentService;
    constructor(studentService: StudentService);
    getStudents(): Promise<{
        success: boolean;
        data: {
            id: string;
            roll_number: string;
            name: string;
            email: string;
            course: string;
            semester: number;
            status: string;
        }[];
    }>;
    createStudent(data: any): Promise<{
        success: boolean;
        data: import("../entities/student.entity").StudentProfile;
    }>;
    updateStudent(id: string, data: any): Promise<{
        success: boolean;
        data: {
            id: string;
            roll_number?: string | undefined;
            name?: string | undefined;
            email?: string | undefined;
            course?: string | undefined;
            semester?: number | undefined;
            status?: string | undefined;
            created_at?: Date | undefined;
        } | null;
    }>;
    deleteStudent(id: string): Promise<{
        success: boolean;
        data: {
            id: string;
        };
    }>;
}

import { StudentService } from '../services/student.service';
export declare class StudentController {
    private readonly studentService;
    constructor(studentService: StudentService);
    getStudents(): Promise<{
        success: boolean;
        data: import("../entities/student.entity").StudentProfile[] | {
            id: string;
            roll_number: string;
            name: string;
            email: string;
            course: string;
            semester: number;
            status: string;
        }[];
    }>;
}

import { FacultyService } from '../services/faculty.service';
export declare class FacultyController {
    private readonly facultyService;
    constructor(facultyService: FacultyService);
    getFaculty(): Promise<{
        success: boolean;
        data: {
            id: string;
            employee_id: string;
            designation: string;
        }[];
    }>;
}

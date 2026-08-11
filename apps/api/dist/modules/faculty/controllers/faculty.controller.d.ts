import { FacultyService } from '../services/faculty.service';
export declare class FacultyController {
    private readonly facultyService;
    constructor(facultyService: FacultyService);
    getFaculty(): Promise<{
        success: boolean;
        data: {
            id: string;
            employee_id: string;
            name: string;
            email: string;
            department: string;
            designation: string;
            status: string;
        }[];
    }>;
    createFaculty(data: any): Promise<{
        success: boolean;
        data: import("../entities/faculty.entity").FacultyProfile;
    }>;
    updateFaculty(id: string, data: any): Promise<{
        success: boolean;
        data: {
            id: string;
            employee_id?: string | undefined;
            name?: string | undefined;
            email?: string | undefined;
            department?: string | undefined;
            designation?: string | undefined;
            status?: string | undefined;
            created_at?: Date | undefined;
        } | null;
    }>;
    deleteFaculty(id: string): Promise<{
        success: boolean;
        data: {
            id: string;
        };
    }>;
}

import { Repository } from 'typeorm';
import { FacultyProfile } from '../entities/faculty.entity';
export declare class FacultyService {
    private facultyRepository;
    private deletedMockIds;
    constructor(facultyRepository: Repository<FacultyProfile>);
    findAll(): Promise<{
        id: string;
        employee_id: string;
        name: string;
        email: string;
        department: string;
        designation: string;
        status: string;
    }[]>;
    create(data: Partial<FacultyProfile>): Promise<FacultyProfile>;
    update(id: string, data: Partial<FacultyProfile>): Promise<{
        id: string;
        employee_id?: string | undefined;
        name?: string | undefined;
        email?: string | undefined;
        department?: string | undefined;
        designation?: string | undefined;
        status?: string | undefined;
        created_at?: Date | undefined;
    } | null>;
    remove(id: string): Promise<{
        id: string;
    }>;
}

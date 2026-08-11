import { Repository } from 'typeorm';
import { StudentProfile } from '../entities/student.entity';
export declare class StudentService {
    private studentRepository;
    private deletedMockIds;
    constructor(studentRepository: Repository<StudentProfile>);
    findAll(): Promise<{
        id: string;
        roll_number: string;
        name: string;
        email: string;
        course: string;
        semester: number;
        status: string;
    }[]>;
    create(data: Partial<StudentProfile>): Promise<StudentProfile>;
    update(id: string, data: Partial<StudentProfile>): Promise<{
        id: string;
        roll_number?: string | undefined;
        name?: string | undefined;
        email?: string | undefined;
        course?: string | undefined;
        semester?: number | undefined;
        status?: string | undefined;
        created_at?: Date | undefined;
    } | null>;
    remove(id: string): Promise<{
        id: string;
    }>;
}

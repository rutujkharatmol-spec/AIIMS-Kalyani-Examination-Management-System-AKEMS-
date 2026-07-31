import { Repository } from 'typeorm';
import { StudentProfile } from '../entities/student.entity';
export declare class StudentService {
    private studentRepository;
    constructor(studentRepository: Repository<StudentProfile>);
    findAll(): Promise<StudentProfile[] | {
        id: string;
        roll_number: string;
        name: string;
        email: string;
        course: string;
        semester: number;
        status: string;
    }[]>;
}

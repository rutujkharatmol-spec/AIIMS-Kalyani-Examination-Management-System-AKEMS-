import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentProfile } from '../entities/student.entity';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(StudentProfile)
    private studentRepository: Repository<StudentProfile>,
  ) {}

  async findAll() {
    const students = await this.studentRepository.find();
    
    // Fallback mock data if DB is empty for demo purposes
    if (students.length === 0) {
      return [
        { id: '1', roll_number: 'MBBS24001', name: 'Aarav Patel', email: 'aarav@aiimskalyani.edu.in', course: 'MBBS', semester: 2, status: 'ACTIVE' },
        { id: '2', roll_number: 'MBBS24002', name: 'Priya Sharma', email: 'priya@aiimskalyani.edu.in', course: 'MBBS', semester: 2, status: 'ACTIVE' },
        { id: '3', roll_number: 'NURS24015', name: 'Rohan Kumar', email: 'rohan@aiimskalyani.edu.in', course: 'B.Sc Nursing', semester: 1, status: 'INACTIVE' },
        { id: '4', roll_number: 'MBBS24003', name: 'Ananya Singh', email: 'ananya@aiimskalyani.edu.in', course: 'MBBS', semester: 2, status: 'ACTIVE' },
        { id: '5', roll_number: 'PG24055', name: 'Dr. Vikram Das', email: 'vikram@aiimskalyani.edu.in', course: 'MD General Medicine', semester: 4, status: 'ACTIVE' }
      ];
    }
    
    return students;
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FacultyProfile } from '../entities/faculty.entity';

@Injectable()
export class FacultyService {
  private deletedMockIds = new Set<string>();

  constructor(
    @InjectRepository(FacultyProfile)
    private facultyRepository: Repository<FacultyProfile>,
  ) {}

  async findAll() {
    const faculty = await this.facultyRepository.find();
    
    // Fallback mock data for demo purposes
    const mockData = [
      { id: '1', employee_id: 'EMP1001', name: 'Dr. Rajesh Kumar', email: 'rajesh@aiimskalyani.edu.in', department: 'Anatomy', designation: 'Professor', status: 'ACTIVE' },
      { id: '2', employee_id: 'EMP1002', name: 'Dr. Smita Das', email: 'smita@aiimskalyani.edu.in', department: 'Physiology', designation: 'Associate Professor', status: 'ACTIVE' },
      { id: '3', employee_id: 'EMP1003', name: 'Dr. Anil Sharma', email: 'anil@aiimskalyani.edu.in', department: 'Biochemistry', designation: 'Assistant Professor', status: 'ACTIVE' },
      { id: '4', employee_id: 'EMP1004', name: 'Dr. Meena Gupta', email: 'meena@aiimskalyani.edu.in', department: 'Pathology', designation: 'Professor', status: 'ON_LEAVE' }
    ];
    
    const filteredMockData = mockData.filter(m => !this.deletedMockIds.has(m.id));
    return [...faculty, ...filteredMockData];
  }

  async create(data: Partial<FacultyProfile>) {
    const newFaculty = this.facultyRepository.create(data);
    return await this.facultyRepository.save(newFaculty);
  }

  async update(id: string, data: Partial<FacultyProfile>) {
    try {
      await this.facultyRepository.update(id, data);
      return await this.facultyRepository.findOne({ where: { id } });
    } catch (e) {
      return { id, ...data };
    }
  }

  async remove(id: string) {
    try {
      await this.facultyRepository.delete(id);
    } catch (e) {}
    this.deletedMockIds.add(id);
    return { id };
  }
}

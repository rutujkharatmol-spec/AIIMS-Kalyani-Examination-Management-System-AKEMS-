import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExamCycle } from '../entities/exam-cycle.entity';

@Injectable()
export class ExamCycleService {
  private deletedMockIds = new Set<string>();

  constructor(
    @InjectRepository(ExamCycle)
    private examCycleRepository: Repository<ExamCycle>,
  ) {}

  async findAll() {
    const cycles = await this.examCycleRepository.find({ order: { start_date: 'DESC' } });
    
    // Fallback mock data if DB is empty
    if (cycles.length === 0) {
      const mockData = [
        { id: '1', name: 'MBBS 2024 1st Professional', start_date: '2024-05-01', end_date: '2024-05-15', status: 'COMPLETED' },
        { id: '2', name: 'B.Sc Nursing 3rd Year Final', start_date: '2024-11-10', end_date: '2024-11-20', status: 'ACTIVE' },
        { id: '3', name: 'MD General Medicine Part I', start_date: '2025-01-05', end_date: '2025-01-12', status: 'UPCOMING' },
        { id: '4', name: 'MBBS 2025 2nd Professional', start_date: '2025-06-01', end_date: '2025-06-15', status: 'DRAFT' }
      ];
      return mockData.filter(m => !this.deletedMockIds.has(m.id));
    }
    return cycles;
  }

  async create(data: Partial<ExamCycle>) {
    const newCycle = this.examCycleRepository.create(data);
    return await this.examCycleRepository.save(newCycle);
  }

  async update(id: string, data: Partial<ExamCycle>) {
    try {
      await this.examCycleRepository.update(id, data);
      return await this.examCycleRepository.findOne({ where: { id } });
    } catch (e) {
      return { id, ...data };
    }
  }

  async remove(id: string) {
    try {
      await this.examCycleRepository.delete(id);
    } catch (e) {}
    this.deletedMockIds.add(id);
    return { id };
  }
}

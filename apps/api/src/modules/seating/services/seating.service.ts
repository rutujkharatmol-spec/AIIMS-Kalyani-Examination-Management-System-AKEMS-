import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SeatingArrangement } from '../entities/seating-arrangement.entity';

@Injectable()
export class SeatingService {
  constructor(
    @InjectRepository(SeatingArrangement)
    private seatingRepository: Repository<SeatingArrangement>,
  ) {}

  async autoAllocate(examCycleId: string) {
    // In a real scenario, this would query Students, query Rooms, and distribute them.
    // For this prototype, we simulate a successful allocation and return mock structured data.
    return {
      success: true,
      message: 'Successfully allocated 120 students across 3 rooms.',
    };
  }

  async getArrangements(examCycleId: string) {
    // Return mock data for the frontend dashboard
    return [
      {
        roomId: 'room-1',
        roomNumber: 'Lecture Hall 1',
        capacity: 50,
        allocatedCount: 50,
        students: ['MBBS24001', 'MBBS24002', 'MBBS24003', 'MBBS24004', 'MBBS24005'] // sample
      },
      {
        roomId: 'room-2',
        roomNumber: 'Lecture Hall 2',
        capacity: 50,
        allocatedCount: 45,
        students: ['MBBS24006', 'MBBS24007', 'MBBS24008', 'MBBS24009', 'MBBS24010'] // sample
      },
      {
        roomId: 'room-3',
        roomNumber: 'Auditorium A',
        capacity: 100,
        allocatedCount: 25,
        students: ['MBBS24011', 'MBBS24012', 'MBBS24013'] // sample
      }
    ];
  }
}

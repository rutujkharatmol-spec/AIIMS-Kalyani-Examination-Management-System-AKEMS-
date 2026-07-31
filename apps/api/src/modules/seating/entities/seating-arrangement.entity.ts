import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('seating_arrangements')
export class SeatingArrangement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  exam_cycle_id: string;

  @Column('uuid')
  room_id: string;

  @Column('uuid')
  student_id: string;

  @Column()
  seat_number: string;

  @CreateDateColumn()
  created_at: Date;
}

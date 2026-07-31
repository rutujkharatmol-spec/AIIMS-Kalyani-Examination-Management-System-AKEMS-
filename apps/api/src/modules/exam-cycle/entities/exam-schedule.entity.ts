import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('exam_schedules')
export class ExamSchedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  exam_cycle_id: string;

  @Column('uuid')
  subject_id: string;

  @Column('date')
  exam_date: Date;

  @Column('time')
  start_time: string;

  @Column('time')
  end_time: string;

  @Column()
  type: string;

  @Column({ default: false })
  is_published: boolean;
}

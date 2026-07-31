import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('exam_cycles')
export class ExamCycle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('date')
  start_date: Date;

  @Column('date')
  end_date: Date;

  @Column({ default: 'DRAFT' })
  status: string;

  @CreateDateColumn()
  created_at: Date;
}

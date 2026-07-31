import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('evaluation_allocations')
export class EvaluationAllocation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  answer_sheet_id: string;

  @Column('uuid')
  evaluator_id: string;

  @Column({ default: 'ASSIGNED' })
  status: string;

  @Column('decimal', { nullable: true })
  total_marks: number;

  @CreateDateColumn()
  assigned_at: Date;
}

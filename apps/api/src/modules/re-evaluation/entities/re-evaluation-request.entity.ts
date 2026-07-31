import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('re_evaluation_requests')
export class ReEvaluationRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  student_id: string;

  @Column('uuid')
  answer_sheet_id: string;

  @Column('text')
  reason: string;

  @Column({ default: 'PENDING' })
  status: string;

  @Column('decimal', { nullable: true })
  previous_total_marks: number;

  @Column('decimal', { nullable: true })
  new_total_marks: number;

  @Column('uuid', { nullable: true })
  workflow_instance_id: string;

  @CreateDateColumn()
  created_at: Date;
}

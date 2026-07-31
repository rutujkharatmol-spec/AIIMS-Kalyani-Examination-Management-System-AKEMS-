import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('question_papers')
export class QuestionPaper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  subject_id: string;

  @Column('uuid')
  exam_cycle_id: string;

  @Column('int')
  total_marks: number;

  @Column('jsonb')
  blueprint: any;

  @Column({ default: 'DRAFT' })
  status: string;

  @Column('uuid', { nullable: true })
  workflow_instance_id: string;

  @Column({ nullable: true })
  encrypted_file_path: string;

  @CreateDateColumn()
  created_at: Date;
}

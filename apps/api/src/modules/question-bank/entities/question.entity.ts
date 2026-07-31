import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  subject_id: string;

  @Column('uuid')
  created_by: string;

  @Column('text')
  text: string;

  @Column()
  type: string; // MCQ, SAQ, LAQ

  @Column('jsonb', { nullable: true })
  options: any;

  @Column({ nullable: true })
  correct_answer: string;

  @Column('int')
  difficulty_level: number;

  @Column('int')
  marks: number;

  @Column({ default: 'DRAFT' })
  status: string;

  @Column('uuid', { nullable: true })
  workflow_instance_id: string;

  @CreateDateColumn()
  created_at: Date;
}

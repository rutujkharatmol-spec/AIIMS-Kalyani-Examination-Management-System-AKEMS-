import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('subject_results')
export class SubjectResult {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  result_record_id: string;

  @Column('uuid')
  subject_id: string;

  @Column('decimal')
  theory_marks: number;

  @Column('decimal')
  practical_marks: number;

  @Column('decimal')
  internal_marks: number;

  @Column()
  grade: string;

  @Column({ default: false })
  grace_marks_applied: boolean;
}

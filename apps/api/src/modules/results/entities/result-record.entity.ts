import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('result_records')
export class ResultRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  student_id: string;

  @Column('uuid')
  exam_cycle_id: string;

  @Column('decimal')
  total_marks_obtained: number;

  @Column('decimal')
  percentage: number;

  @Column({ nullable: true })
  final_grade: string;

  @Column()
  status: string;

  @Column({ default: false })
  is_published: boolean;

  @Column({ nullable: true })
  published_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

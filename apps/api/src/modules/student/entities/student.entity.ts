import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('student_profiles')
export class StudentProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  user_id: string;

  @Column({ unique: true })
  roll_number: string;

  @Column('uuid')
  course_id: string;

  @Column('uuid')
  batch_id: string;

  @Column('int')
  current_semester: number;

  @Column()
  status: string;

  @CreateDateColumn()
  created_at: Date;
}

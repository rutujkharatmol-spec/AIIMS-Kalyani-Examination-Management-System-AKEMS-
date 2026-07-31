import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('faculty_profiles')
export class FacultyProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  user_id: string;

  @Column({ unique: true })
  employee_id: string;

  @Column('uuid')
  department_id: string;

  @Column()
  designation: string;

  @Column({ default: true })
  is_available_for_exam: boolean;

  @CreateDateColumn()
  created_at: Date;
}

import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('student_profiles')
export class StudentProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  roll_number: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  course: string;

  @Column('int', { default: 1 })
  semester: number;

  @Column({ default: 'ACTIVE' })
  status: string;

  @CreateDateColumn()
  created_at: Date;
}

import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('faculty_profiles')
export class FacultyProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  employee_id: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  department: string;

  @Column({ nullable: true })
  designation: string;

  @Column({ default: 'ACTIVE' })
  status: string;

  @CreateDateColumn()
  created_at: Date;
}

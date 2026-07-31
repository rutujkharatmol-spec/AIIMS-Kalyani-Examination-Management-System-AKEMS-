import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  code: string;

  @Column('uuid')
  department_id: string;

  @Column('int')
  duration_years: number;
}

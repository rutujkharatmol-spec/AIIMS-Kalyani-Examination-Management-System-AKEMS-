import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('attendance_records')
export class AttendanceRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  schedule_id: string;

  @Column('uuid')
  student_id: string;

  @Column('uuid')
  room_id: string;

  @Column('uuid')
  invigilator_id: string;

  @Column({ nullable: true })
  answer_sheet_barcode: string;

  @Column({ default: 'PRESENT' })
  status: string; // PRESENT, ABSENT, MALPRACTICE

  @CreateDateColumn()
  scanned_at: Date;
}

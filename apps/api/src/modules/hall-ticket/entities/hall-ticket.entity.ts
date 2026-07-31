import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('hall_tickets')
export class HallTicket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  student_id: string;

  @Column('uuid')
  exam_cycle_id: string;

  @Column({ unique: true })
  barcode: string;

  @Column({ default: 'GENERATED' })
  status: string;

  @Column({ nullable: true })
  pdf_path: string;

  @CreateDateColumn()
  created_at: Date;
}

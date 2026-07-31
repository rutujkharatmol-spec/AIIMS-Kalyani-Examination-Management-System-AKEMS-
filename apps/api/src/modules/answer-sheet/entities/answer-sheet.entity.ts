import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('answer_sheets')
export class AnswerSheet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  exam_schedule_id: string;

  @Column()
  original_barcode: string;

  @Column({ unique: true })
  dummy_number: string;

  @Column('uuid')
  student_id: string;

  @Column({ nullable: true })
  pdf_path: string;

  @Column({ default: 'COLLECTED' })
  status: string;

  @CreateDateColumn()
  collected_at: Date;
}

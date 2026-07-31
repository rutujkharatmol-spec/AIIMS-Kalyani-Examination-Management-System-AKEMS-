import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('notification_logs')
export class NotificationLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { nullable: true })
  user_id: string;

  @Column()
  channel: string;

  @Column({ default: 'PENDING' })
  status: string;

  @Column('text')
  payload: string;

  @Column('text', { nullable: true })
  error_reason: string;

  @CreateDateColumn()
  created_at: Date;
}

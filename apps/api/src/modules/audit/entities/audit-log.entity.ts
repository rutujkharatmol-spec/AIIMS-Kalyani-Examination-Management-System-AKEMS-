import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  user_id: string;

  @Column()
  action: string;

  @Column()
  resource_type: string;

  @Column('uuid', { nullable: true })
  resource_id: string;

  @Column('jsonb', { nullable: true })
  old_value: any;

  @Column('jsonb', { nullable: true })
  new_value: any;

  @Column({ nullable: true })
  ip_address: string;

  @Column({ nullable: true })
  user_agent: string;

  @Column({ nullable: true })
  reason: string;

  @CreateDateColumn()
  created_at: Date;
}

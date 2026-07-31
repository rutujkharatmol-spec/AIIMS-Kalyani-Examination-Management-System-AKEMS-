import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('workflow_instances')
export class WorkflowInstance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  workflow_id: string;

  @Column('uuid')
  entity_id: string;

  @Column('int')
  current_step_order: number;

  @Column({ default: 'PENDING' })
  status: string;

  @Column('uuid')
  initiated_by: string;

  @CreateDateColumn()
  created_at: Date;
}

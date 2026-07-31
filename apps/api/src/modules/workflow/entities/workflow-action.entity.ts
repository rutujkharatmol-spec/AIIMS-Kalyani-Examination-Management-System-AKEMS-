import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('workflow_actions')
export class WorkflowActionLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  instance_id: string;

  @Column('int')
  step_order: number;

  @Column('uuid')
  actor_id: string;

  @Column()
  action: string;

  @Column({ nullable: true })
  comments: string;

  @CreateDateColumn()
  acted_at: Date;
}

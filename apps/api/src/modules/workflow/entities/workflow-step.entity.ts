import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('workflow_steps')
export class WorkflowStep {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  workflow_id: string;

  @Column('int')
  step_order: number;

  @Column()
  required_role: string;

  @Column()
  action_type: string;
}

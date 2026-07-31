import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('cron_jobs')
export class CronJob {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  cron_expression: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ nullable: true })
  last_run_at: Date;

  @Column({ nullable: true })
  last_run_status: string;
}

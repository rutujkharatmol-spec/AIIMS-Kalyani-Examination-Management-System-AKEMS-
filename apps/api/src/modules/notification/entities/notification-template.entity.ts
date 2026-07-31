import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('notification_templates')
export class NotificationTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  channel: string; // EMAIL, SMS, PUSH

  @Column({ nullable: true })
  subject: string;

  @Column('text')
  body_template: string;
}

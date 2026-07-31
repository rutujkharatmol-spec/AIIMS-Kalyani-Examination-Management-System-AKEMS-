import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  building_id: string;

  @Column()
  room_number: string;

  @Column('int')
  total_capacity: number;

  @Column('int')
  exam_capacity: number;

  @Column({ default: false })
  is_exam_centre: boolean;

  @Column()
  status: string;
}

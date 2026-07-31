import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('file_metadata')
export class FileMetadata {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  original_name: string;

  @Column()
  mime_type: string;

  @Column('int')
  size_bytes: number;

  @Column()
  storage_path: string;

  @Column({ nullable: true })
  file_hash: string;

  @Column('uuid')
  uploaded_by: string;

  @Column({ default: 'PENDING' })
  scan_status: string; // PENDING, CLEAN, INFECTED

  @CreateDateColumn()
  created_at: Date;
}

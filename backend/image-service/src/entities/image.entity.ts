import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

export enum ProcessingStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

@Entity('images')
export class Image {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'original_name' })
  originalName: string;

  @Column({ name: 'file_path' })
  filePath: string;

  @Column({
    name: 'processing_status',
    type: 'enum',
    enum: ProcessingStatus,
    default: ProcessingStatus.PENDING,
  })
  processingStatus: ProcessingStatus;

  @Column({ type: 'json', nullable: true })
  dimensions: {
    width: number;
    height: number;
  } | null;

  @Column({ name: 'user_id' })
  userId: string;

  @CreateDateColumn({ name: 'upload_date' })
  uploadDate: Date;

  @Column({ name: 'optimized_path', nullable: true })
  optimizedPath: string | null;
}

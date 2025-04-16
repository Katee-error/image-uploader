export interface ImageDimensions {
  width: number;
  height: number;
}

export interface Image {
  id: string;
  originalName: string;
  filePath: string;
  processingStatus: ProcessingStatus;
  dimensions: ImageDimensions;
  userId: string;
  uploadDate: string;
  optimizedPath?: string;
}

export enum ProcessingStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface UploadImageResponse {
  success: boolean;
  message: string;
  image: Image;
  originalImageUrl: string;
}

export interface DropzoneProps {
  getRootProps: () => any;
  getInputProps: () => any;
  isDragActive: boolean;
  isUploading: boolean;
}



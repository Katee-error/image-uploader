
export interface UploadImageRequest {
  metadata?: {
    filename: string;
    contentType: string;
    userId: string;
  };
  chunk?: Uint8Array;
}

export interface UploadImageResponse {
  success: boolean;
  message: string;
  image?: ImageInfo;
  originalImageUrl: string;
}

export interface GetImageByIdRequest {
  imageId: string;
}

export interface GetOriginalImageRequest {
  imageId: string;
}

export interface GetOptimizedImageRequest {
  imageId: string;
}

export interface GetImageResponse {
  success: boolean;
  message: string;
  imageData: Uint8Array;
  contentType: string;
}

export interface ImageInfo {
  id: string;
  originalName: string;
  filePath: string;
  processingStatus: string;
  dimensions?: {
    width: number;
    height: number;
  };
  userId: string;
  uploadDate: string;
  optimizedPath?: string;
}

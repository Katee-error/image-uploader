import { Controller, OnModuleInit } from "@nestjs/common";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable, Subject } from "rxjs";
import { ImageService } from "./image.service";
import { Image, ProcessingStatus } from "../entities/image.entity";

interface UploadImageRequest {
  metadata?: {
    filename: string;
    contentType: string;
    userId: string;
  };
  chunk?: Uint8Array;
}

interface UploadImageResponse {
  success: boolean;
  message: string;
  image?: ImageInfo;
  originalImageUrl: string;
}

interface GetUserLastImageRequest {
  userId: string;
}

interface GetImageByIdRequest {
  imageId: string;
}

interface GetOriginalImageRequest {
  imageId: string;
}

interface GetOptimizedImageRequest {
  imageId: string;
}

interface GetImageResponse {
  success: boolean;
  message: string;
  imageData: Uint8Array;
  contentType: string;
}

interface ImageInfo {
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

@Controller()
export class ImageController implements OnModuleInit {
  constructor(private readonly imageService: ImageService) {}

  private readonly imageStreams = new Map<string, Subject<UploadImageRequest>>();

  onModuleInit() {}

  @GrpcStreamMethod("ImageService", "UploadImage")
  uploadImage(
    messages: Observable<UploadImageRequest>,
    metadata: any
  ): Observable<UploadImageResponse> {
    const subject = new Subject<UploadImageResponse>();
    const chunks: Uint8Array[] = [];
    let imageMetadata: UploadImageRequest["metadata"];

    messages.subscribe({
      next: async (message: UploadImageRequest) => {
        if (message.metadata) {
          imageMetadata = message.metadata;
        } else if (message.chunk) {
          const chunk = new Uint8Array(
            message.chunk.buffer,
            message.chunk.byteOffset,
            message.chunk.byteLength
          );
          chunks.push(chunk);
        }
      },
      complete: async () => {
        try {
          if (!imageMetadata) {
            subject.next({
              success: false,
              message: "No metadata provided",
              originalImageUrl: "",
            });
            subject.complete();
            return;
          }

          const totalLength = chunks.reduce((acc, chunk) => acc + chunk.byteLength, 0);
          const fileBuffer = new Uint8Array(totalLength);
          let offset = 0;
          for (const chunk of chunks) {
            fileBuffer.set(chunk, offset);
            offset += chunk.byteLength;
          }

          const imageEntity = await this.imageService.uploadImage(
            Buffer.from(fileBuffer),
            imageMetadata.filename,
            imageMetadata.contentType,
            imageMetadata.userId
          );

          const imageInfo = this.mapImageToInfo(imageEntity);

          subject.next({
            success: true,
            message: "Image uploaded successfully",
            originalImageUrl: imageEntity.filePath,
            image: this.mapImageToInfo(imageEntity),
          }); 
          
        } catch (error: any) {
          console.error("[❌] Upload error:", error);
          subject.next({
            success: false,
            message: error.message || "Failed to upload image",
            originalImageUrl: "",
          });
        } finally {
          subject.complete();
        }
      },
      error: (err) => {
        subject.next({
          success: false,
          message: err.message || "Error processing upload",
          originalImageUrl: "",
        });
        subject.complete();
      },
    });

    return subject.asObservable();
  }

  @GrpcMethod("ImageService", "GetUserLastImage")
  async getUserLastImage(
    request: GetUserLastImageRequest
  ): Promise<ImageInfo | null> {
    try {
      const image = await this.imageService.getUserLastImage(request.userId);
      if (!image) {
        return null;
      }
      return this.mapImageToInfo(image);
    } catch (error) {
      return null;
    }
  }

  @GrpcMethod("ImageService", "GetImageById")
  async getImageById(request: GetImageByIdRequest): Promise<ImageInfo | null> {
    try {
      const image = await this.imageService.getImageById(request.imageId);
      return this.mapImageToInfo(image);
    } catch (error) {
      return null;
    }
  }

  @GrpcMethod("ImageService", "GetOriginalImage")
  async getOriginalImage(
    request: GetOriginalImageRequest
  ): Promise<GetImageResponse> {
    try {
      const { buffer, contentType } = await this.imageService.getOriginalImageData(request.imageId);
      return {
        success: true,
        message: "Original image retrieved successfully",
        imageData: new Uint8Array(buffer),
        contentType,
      };
    } catch (error: any) {
      console.error(`Error in getOriginalImage gRPC method: ${error.message}`);
      return {
        success: false,
        message: error.message || "Failed to get original image",
        imageData: new Uint8Array(),
        contentType: "",
      };
    }
  }

  @GrpcMethod("ImageService", "GetOptimizedImage")
  async getOptimizedImage(
    request: GetOptimizedImageRequest
  ): Promise<GetImageResponse> {
    try {
      const { buffer, contentType } = await this.imageService.getOptimizedImageData(request.imageId);
      console.log(`[📏] Buffer size: ${buffer.length} bytes`);
      return {
        success: true,
        message: "Optimized image retrieved successfully",
        imageData: new Uint8Array(buffer),
        contentType,
      };
    } catch (error: any) {
      console.error(`Error in getOptimizedImage gRPC method: ${error.message}`);
      return {
        success: false,
        message: error.message || "Failed to get optimized image",
        imageData: new Uint8Array(),
        contentType: "",
      };
    }
  }

  private mapImageToInfo(image: Image): ImageInfo {
    return {
      id: image.id,
      originalName: image.originalName,
      filePath: image.filePath,
      processingStatus: image.processingStatus,
      dimensions: image.dimensions || undefined,
      userId: image.userId,
      uploadDate: image.uploadDate.toISOString(),
      optimizedPath: image.optimizedPath || undefined,
    };
  }
}


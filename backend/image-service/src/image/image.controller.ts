import { Controller } from "@nestjs/common";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable, Subject } from "rxjs";
import { ImageService } from "./image.service";
import { Image } from "../entities/image.entity";
import { GetImageByIdRequest, GetImageResponse, GetOptimizedImageRequest, GetOriginalImageRequest, ImageInfo, UploadImageRequest, UploadImageResponse } from "./image.interface";

@Controller()
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @GrpcStreamMethod("ImageService", "UploadImage")
  uploadImage(
    messages: Observable<UploadImageRequest>
  ): Observable<UploadImageResponse> {
    const subject = new Subject<UploadImageResponse>();
    const chunks: Uint8Array[] = [];
    let metadata: UploadImageRequest["metadata"];

    messages.subscribe({
      next: async (message) => {
        if (message.metadata) {
          metadata = message.metadata;
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
          if (!metadata) {
            return subjectError(subject, "No metadata provided");
          }

          const buffer = this.concatChunks(chunks);

          const imageEntity = await this.imageService.uploadImage(
            Buffer.from(buffer),
            metadata.filename,
            metadata.contentType,
            metadata.userId
          );

          subject.next({
            success: true,
            message: "Image uploaded successfully",
            originalImageUrl: imageEntity.filePath,
            image: ImageController.mapImageToInfo(imageEntity),
          });
        } catch (error) {
          console.error("[❌] Upload error:", error);
          subjectError(subject, (error as Error).message || "Failed to upload image");
        } finally {
          subject.complete();
        }
      },
      error: (err: unknown) => {
        console.error("[❌] Stream error:", err);
        subjectError(subject, (err as Error).message || "Error processing upload");
        subject.complete();
      },
    });

    return subject.asObservable();
  }

  @GrpcMethod("ImageService", "GetImageById")
  async getImageById(request: GetImageByIdRequest): Promise<ImageInfo | null> {
    try {
      const image = await this.imageService.getImageById(request.imageId);
      return ImageController.mapImageToInfo(image);
    } catch {
      return null;
    }
  }

  @GrpcMethod("ImageService", "GetOriginalImage")
  async getOriginalImage(
    request: GetOriginalImageRequest
  ): Promise<GetImageResponse> {
    try {
      const { buffer, contentType } = await this.imageService.getOriginalImageData(
        request.imageId
      );
      return {
        success: true,
        message: "Original image retrieved successfully",
        imageData: new Uint8Array(buffer),
        contentType,
      };
    } catch (error: unknown) {
      return this.handleImageError("getOriginalImage", error);
    }
  }

  @GrpcMethod("ImageService", "GetOptimizedImage")
  async getOptimizedImage(
    request: GetOptimizedImageRequest
  ): Promise<GetImageResponse> {
    try {
      const { buffer, contentType } = await this.imageService.getOptimizedImageData(
        request.imageId
      );
      return {
        success: true,
        message: "Optimized image retrieved successfully",
        imageData: new Uint8Array(buffer),
        contentType,
      };
    } catch (error: unknown) {
      return this.handleImageError("getOptimizedImage", error);
    }
  }

  //  Helpers
  private concatChunks(chunks: Uint8Array[]): Uint8Array {
    const totalLength = chunks.reduce((acc, chunk) => acc + chunk.byteLength, 0);
    const fileBuffer = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
      fileBuffer.set(chunk, offset);
      offset += chunk.byteLength;
    }
    return fileBuffer;
  }

  private handleImageError(method: string, error: unknown): GetImageResponse {
    console.error(`Error in ${method} gRPC method:`, error);
    return {
      success: false,
      message: (error as Error).message || `Failed to get image`,
      imageData: new Uint8Array(),
      contentType: "",
    };
  }

  private static mapImageToInfo(image: Image): ImageInfo {
    return {
      id: image.id,
      originalName: image.originalName,
      filePath: image.filePath,
      processingStatus: image.processingStatus,
      dimensions: image.dimensions,
      userId: image.userId,
      uploadDate: image.uploadDate.toISOString(),
      optimizedPath: image.optimizedPath,
    };
  }
}

// Error utility
function subjectError(subject: Subject<UploadImageResponse>, message: string) {
  subject.next({
    success: false,
    message,
    originalImageUrl: "",
  });
}
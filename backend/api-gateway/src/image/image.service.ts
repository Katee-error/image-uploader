import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, Observable } from 'rxjs';
import {
  ImageServiceClient,
  UploadImageRequest,
  UploadImageResponse,
  GetImageResponse,
  ImageInfo,
} from '../generated/image.pb';

@Injectable()
export class ImageService implements OnModuleInit {
  private imageService: ImageServiceClient;

  constructor(@Inject('IMAGE_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.imageService = this.client.getService<ImageServiceClient>('ImageService');
  }

  uploadImage(stream: Observable<UploadImageRequest>): Observable<UploadImageResponse> {
    return this.imageService.uploadImage(stream);
  }

  async getOriginalImage(imageId: string): Promise<GetImageResponse> {
    try {
      const response = await firstValueFrom(
        this.imageService.getOriginalImage({ imageId })
      );

      return response;
    } catch (error: any) {
      console.error(`API Gateway: Error getting original image: ${error?.message}`);
      return {
        success: false,
        message: error?.message || 'Failed to get original image',
        imageData: new Uint8Array(),
        contentType: '',
      };
    }
  }

  async getOptimizedImage(imageId: string): Promise<GetImageResponse> {
    try {
      const response = await firstValueFrom(
        this.imageService.getOptimizedImage({ imageId })
      );

      return response;
    } catch (error: any) {
      console.error(`API Gateway: Error getting optimized image: ${error?.message}`);
      return {
        success: false,
        message: error?.message || 'Failed to get optimized image',
        imageData: new Uint8Array(),
        contentType: '',
      };
    }
  }

  async getImageById(imageId: string): Promise<ImageInfo | null> {
    try {
      const response = await firstValueFrom(
        this.imageService.getImageById({ imageId })
      );
      return response ?? null;
    } catch (error) {
      console.error('Error in getImageById:', error);
      return null;
    }
  }
}

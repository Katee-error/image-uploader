import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { S3Service } from './s3.service';
import { Image, ProcessingStatus } from '../entities/image.entity';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
    @InjectQueue('image-processing')
    private readonly imageProcessingQueue: Queue,
    private readonly s3Service: S3Service,
  ) {}

  async uploadImage(
    file: Buffer,
    originalName: string,
    contentType: string,
    userId: string,
  ): Promise<Image> {
    // Upload original image to S3
    const filePath = await this.s3Service.uploadFile(file, originalName, contentType);

    // Create image record in database
    const image = this.imageRepository.create({
      originalName,
      filePath,
      processingStatus: ProcessingStatus.PENDING,
      userId,
    });

    const savedImage = await this.imageRepository.save(image);

    // Add image to processing queue
    await this.imageProcessingQueue.add('optimize', {
      imageId: savedImage.id,
      filePath,
    });

    return await this.imageRepository.findOneOrFail({
      where: { id: savedImage.id },
    });
    
  }

  async getUserLastImage(userId: string): Promise<Image | null> {
    const image = await this.imageRepository.findOne({
      where: { userId },
      order: { uploadDate: 'DESC' },
    });

    return image;
  }

  async getImageById(id: string): Promise<Image> {
    const image = await this.imageRepository.findOne({
      where: { id },
    });

    if (!image) {
      throw new NotFoundException(`Image with ID ${id} not found`);
    }

    return image;
  }

  async getOptimizedImageUrl(id: string): Promise<string> {
    const image = await this.getImageById(id);

    if (image.processingStatus !== ProcessingStatus.COMPLETED || !image.optimizedPath) {
      throw new NotFoundException('Optimized image not available yet');
    }

    console.log(`Returning optimized image URL: ${image.optimizedPath}`);
    
    // Return the optimized path directly, which should now be a public URL
    return image.optimizedPath;
  }

  async getOriginalImageData(id: string): Promise<{ buffer: Buffer; contentType: string; url: string }> {
    const image = await this.getImageById(id);

    console.log(`Fetching original image data from: ${image.filePath}`);
    
    try {
      // Extract the key from the filePath
      const urlParts = new URL(image.filePath);
      const pathParts = urlParts.pathname.split('/');
      // The key should be in the format "original/uuid-filename.ext"
      const key = pathParts.slice(pathParts.indexOf('original')).join('/');
      console.log(`Original image key: ${key}`);
      
      // Get a signed URL for the image
      const imageUrl = await this.s3Service.getFileUrl(key);
      console.log(`Original image signed URL: ${imageUrl}`);

      // Fetch the image data
      const response = await fetch(imageUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch original image: ${response.statusText}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      console.log(`Original image buffer size: ${buffer.length} bytes`);
      
      return {
        buffer,
        contentType: image.originalName.split('.').pop() || 'application/octet-stream',
        url: image.filePath
      };
    } catch (error) {
      console.error(`Error fetching original image data: ${error.message}`);
      throw new NotFoundException(`Failed to fetch original image: ${error.message}`);
    }
  }

  async getOptimizedImageData(id: string): Promise<{ buffer: Buffer; contentType: string; url: string }> {
    const image = await this.getImageById(id);

    if (image.processingStatus !== ProcessingStatus.COMPLETED || !image.optimizedPath) {
      throw new NotFoundException('Optimized image not available yet');
    }

    console.log(`Fetching optimized image data from: ${image.optimizedPath}`);
    
    try {
      // Extract the key from the optimizedPath
      const urlParts = new URL(image.optimizedPath);
      const pathParts = urlParts.pathname.split('/');
      // The key should be in the format "optimized/uuid-filename.webp"
      const key = pathParts.slice(pathParts.indexOf('optimized')).join('/');
      console.log(`Optimized image key: ${key}`);
      
      // Get a signed URL for the image
      const imageUrl = await this.s3Service.getFileUrl(key);
      console.log(`Optimized image signed URL: ${imageUrl}`);

      // Fetch the image data
      const response = await fetch(imageUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch optimized image: ${response.statusText}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      console.log(`Optimized image buffer size: ${buffer.length} bytes`);
      
      return {
        buffer,
        contentType: 'image/webp',
        url: image.optimizedPath
      };
    } catch (error) {
      console.error(`Error fetching optimized image data: ${error.message}`);
      throw new NotFoundException(`Failed to fetch optimized image: ${error.message}`);
    }
  }
}

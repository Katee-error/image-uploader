import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from 'bull';
import { S3Service } from './s3.service';
import { Image, ProcessingStatus } from '../entities/image.entity';
import sharp from 'sharp';
import NodeCache from 'node-cache';

interface ProcessImageData {
  imageId: string;
  filePath: string;
}

@Processor('image-processing')
export class ImageProcessor {
  private readonly logger = new Logger(ImageProcessor.name);
  private readonly cache: NodeCache;

  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
    private readonly s3Service: S3Service,
  ) {
    this.cache = new NodeCache({ stdTTL: 600 }); // Cache for 10 minutes
  }

  @Process({ name: 'optimize', concurrency: 5 })
  async processImage(job: Job<ProcessImageData>) {
    const { imageId, filePath } = job.data;
    this.logger.log(`Processing image ${imageId}`);

    try {
      // Check cache first
      const cachedResult = this.cache.get(imageId);
      if (cachedResult) {
        this.logger.log(`Using cached result for image ${imageId}`);
        await this.imageRepository.update(imageId, cachedResult);
        return;
      }

      // Update status to PROCESSING
      await this.imageRepository.update(imageId, {
        processingStatus: ProcessingStatus.PROCESSING,
      });

      const urlParts = new URL(filePath);
      const pathParts = urlParts.pathname.split('/');
      const key = pathParts.slice(pathParts.indexOf('original')).join('/');
      const imageUrl = await this.s3Service.getFileUrl(key);
      
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      const imageBuffer = Buffer.from(arrayBuffer);
      
      let metadata = await sharp(imageBuffer).metadata();
      
      // Process the image with Sharp
      const processedImageBuffer = await sharp(imageBuffer)
        .webp({ quality: 70 }) // Reduced quality for faster processing
        .toBuffer();

      const originalName = filePath.split('/').pop() || 'image.jpg';
      const optimizedName = `${originalName.split('.')[0]}.webp`;
      
      const optimizedPath = await this.s3Service.uploadFile(
        processedImageBuffer,
        optimizedName,
        'image/webp',
        'optimized',
      );

      const result = {
        processingStatus: ProcessingStatus.COMPLETED,
        dimensions: {
          width: metadata.width,
          height: metadata.height,
        },
        optimizedPath: optimizedPath,
      };

      // Update the image record in the database
      await this.imageRepository.update(imageId, result);

      // Cache the result
      this.cache.set(imageId, result);

      this.logger.log(`Successfully processed image ${imageId}`);
    } catch (error) {
      this.logger.error(`Failed to process image ${imageId}`, error.stack);
      
      // Update status to FAILED
      await this.imageRepository.update(imageId, {
        processingStatus: ProcessingStatus.FAILED,
      });
    }
  }
}

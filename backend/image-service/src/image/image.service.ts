import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";
import { S3Service } from "./s3.service";
import { Image, ProcessingStatus } from "../entities/image.entity";
import { resolveContentType } from "src/utils/mime-type.util";
import { extractS3KeyFromUrl, fetchImageFromS3 } from "src/utils/s3.util";

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
    @InjectQueue("image-processing")
    private readonly imageProcessingQueue: Queue,
    private readonly s3Service: S3Service
  ) {}

  async uploadImage(
    file: Buffer,
    originalName: string,
    contentType: string,
    userId: string
  ): Promise<Image> {
    const filePath = await this.s3Service.uploadFile(
      file,
      originalName,
      contentType
    );

    const image = this.imageRepository.create({
      originalName,
      filePath,
      processingStatus: ProcessingStatus.PENDING,
      userId,
    });

    const savedImage = await this.imageRepository.save(image);

    try {
      await this.imageProcessingQueue.add("optimize", {
        imageId: savedImage.id,
        filePath,
      });
    } catch (err) {
      console.error(
        `[Queue] Failed to add job for imageId=${savedImage.id}: ${err.message}`
      );
    }

    return this.imageRepository.findOneOrFail({ where: { id: savedImage.id } });
  }

  async getImageById(id: string): Promise<Image> {
    const image = await this.imageRepository.findOne({ where: { id } });

    if (!image) {
      throw new NotFoundException(`Image with ID ${id} not found`);
    }
    return image;
  }

  async getOptimizedImageUrl(id: string): Promise<string> {
    const image = await this.getImageById(id);

    if (
      image.processingStatus !== ProcessingStatus.COMPLETED ||
      !image.optimizedPath
    ) {
      throw new NotFoundException("Optimized image not available yet");
    }

    return image.optimizedPath;
  }

  async getOriginalImageData(
    id: string
  ): Promise<{ buffer: Buffer; contentType: string; url: string }> {
    const image = await this.getImageById(id);

    const key = extractS3KeyFromUrl(image.filePath, "original");
    const buffer = await fetchImageFromS3(this.s3Service.getFileUrl.bind(this.s3Service), key, "original");
    
    const contentType = resolveContentType(image.originalName);

    return {
      buffer,
      contentType,
      url: image.filePath,
    };
  }

  async getOptimizedImageData(
    id: string
  ): Promise<{ buffer: Buffer; contentType: string; url: string }> {
    const image = await this.getImageById(id);

    if (
      image.processingStatus !== ProcessingStatus.COMPLETED ||
      !image.optimizedPath
    ) {
      throw new NotFoundException("Optimized image not available yet");
    }

    const key = extractS3KeyFromUrl(image.optimizedPath, "optimized");
    const buffer = await fetchImageFromS3(
      this.s3Service.getFileUrl.bind(this.s3Service),
      key,
      "optimized"
    );

    return {
      buffer,
      contentType: "image/webp",
      url: image.optimizedPath,
    };
  }

}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { ImageProcessor } from './image.processor';
import { Image } from '../entities/image.entity';
import { S3Service } from './s3.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Image]),
    BullModule.registerQueue({
      name: 'image-processing',
    }),
    ConfigModule,
  ],
  controllers: [ImageController],
  providers: [ImageService, ImageProcessor, S3Service],
  exports: [ImageService],
})
export class ImageModule {}

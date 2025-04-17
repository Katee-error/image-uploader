import { Controller, Post, Body, Headers, UnauthorizedException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WebsocketService } from './websocket.service';
import { Public } from '../auth/public.decorator';
import { ImageService } from '../image/image.service';

interface NotifyImageUpdateDto {
  imageId: string;
}

@Controller('internal/websocket')
export class InternalController {
  private readonly logger = new Logger(InternalController.name);
  private readonly internalServiceKey: string;

  constructor(
    private readonly websocketService: WebsocketService,
    private readonly configService: ConfigService,
    private readonly imageService: ImageService,
  ) {
    this.internalServiceKey = this.configService.get<string>('INTERNAL_SERVICE_KEY', 'internal-service-key');
  }

  @Public()
  @Post('notify-image-update')
  async notifyImageUpdate(
    @Headers('internal-service-key') serviceKey: string,
    @Body() dto: NotifyImageUpdateDto,
  ) {
    if (serviceKey !== this.internalServiceKey) {
      this.logger.warn('Unauthorized attempt to access internal endpoint');
      throw new UnauthorizedException('Invalid internal service key');
    }

    if (!dto.imageId) {
      return { success: false, message: 'Image ID is required' };
    }

    this.logger.log(`Received notification for image update: ${dto.imageId}`);
    
    await this.websocketService.notifyImageUpdate(dto.imageId);
    
    return { success: true, message: 'Notification sent successfully' };
  }
  
  @Public()
  @Post('image-processed')
  async imageProcessed(
    @Headers('x-internal-service-key') serviceKey: string,
    @Body() dto: NotifyImageUpdateDto,
  ) {
    // Validate the internal service key
    if (serviceKey !== this.internalServiceKey) {
      this.logger.warn('Unauthorized attempt to access internal endpoint');
      throw new UnauthorizedException('Invalid internal service key');
    }

    if (!dto.imageId) {
      return { success: false, message: 'Image ID is required' };
    }

    this.logger.log(`Received notification for processed image: ${dto.imageId}`);
    
    try {
      const image = await this.imageService.getImageById(dto.imageId);
      
      if (!image) {
        this.logger.warn(`Image not found: ${dto.imageId}`);
        return { success: false, message: 'Image not found' };
      }
      
      await this.websocketService.notifyImageUpdate(dto.imageId);
      
      return { success: true, message: 'Notification sent successfully' };
    } catch (error) {
      this.logger.error(`Error processing image notification: ${error.message}`);
      return { success: false, message: 'Error processing notification' };
    }
  }
}

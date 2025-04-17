import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { ImageService } from '../image/image.service';
import { ImageInfo } from '../generated/image.pb';

@Injectable()
export class WebsocketService {
  private server: Server;

  constructor(private readonly imageService: ImageService) {}

  setServer(server: Server) {
    this.server = server;
  }

  async notifyImageUpdate(imageId: string) {
    try {
      if (!this.server) {
        return;
      }

      const image = await this.imageService.getImageById(imageId);
      if (!image) {
        return;
      }
      this.server.to(`image:${imageId}`).emit('image:update', image);

      this.server.to(`user:${image.userId}`).emit('image:update', image);
    } catch (error) {
      console.error('Error notifying image update:', error);
    }
  }
}

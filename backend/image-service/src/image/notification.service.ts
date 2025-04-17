import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private apiGatewayUrl: string;
  private internalServiceKey: string;

  constructor(
    private readonly configService: ConfigService,
  ) {
    this.apiGatewayUrl = this.configService.get<string>('API_GATEWAY_URL', 'http://localhost:3003');
    this.internalServiceKey = this.configService.get<string>('INTERNAL_SERVICE_KEY', 'internal-service-key');
    this.logger.log(`Initialized with API Gateway URL: ${this.apiGatewayUrl}`);
  }

  /**
   * Notify the API Gateway about an image update
   * @param imageId The ID of the updated image
   */
  async notifyImageProcessed(imageId: string): Promise<void> {
    try {
      const url = `${this.apiGatewayUrl}/api/internal/websocket/image-processed`;
      this.logger.log(`Notifying API Gateway at ${url} about processed image ${imageId}`);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Internal-Service-Key': this.internalServiceKey,
        },
        body: JSON.stringify({ imageId }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to notify API Gateway: ${response.status} ${errorText}`);
      }
      this.logger.log(`Successfully notified API Gateway about processed image ${imageId}`);
    } catch (error) {
      this.logger.error(`Error notifying API Gateway about processed image ${imageId}:`, error.stack);
    }
  }
}

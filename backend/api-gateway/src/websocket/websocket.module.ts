import { Module } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';
import { WebsocketService } from './websocket.service';
import { InternalController } from './internal.controller';
import { AuthModule } from '../auth/auth.module';
import { ImageModule } from '../image/image.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [AuthModule, ImageModule, ConfigModule],
  controllers: [InternalController],
  providers: [WebsocketGateway, WebsocketService],
  exports: [WebsocketService],
})
export class WebsocketModule {}

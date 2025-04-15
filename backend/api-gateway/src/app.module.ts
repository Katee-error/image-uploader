import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { ImageModule } from './image/image.module';
import { WebsocketModule } from './websocket/websocket.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ClientsModule.registerAsync([
      {
        name: 'AUTH_PACKAGE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'auth',
            protoPath: join(__dirname, '../../proto/auth.proto'),
            url: configService.get('AUTH_SERVICE_URL', 'localhost:50051'),
          },
        }),
      },
      {
        name: 'IMAGE_PACKAGE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'image',
            protoPath: join(__dirname, '../../proto/image.proto'),
            url: configService.get('IMAGE_SERVICE_URL', 'localhost:50052'),
          },
        }),
      },
    ]),
    AuthModule,
    ImageModule,
    WebsocketModule,
  ],
})
export class AppModule {}

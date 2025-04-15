import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'IMAGE_PACKAGE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'image',
            protoPath: join(__dirname, '../../../proto/image.proto'),
            url: configService.get('IMAGE_SERVICE_URL', 'localhost:50052'),
          },
        }),
      },
    ]),
    AuthModule,
  ],
  controllers: [ImageController],
  providers: [ImageService],
  exports: [ImageService],
})
export class ImageModule {}

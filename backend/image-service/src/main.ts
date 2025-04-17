import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'image',
      protoPath: join(__dirname, '../../proto/image.proto'),
      url: configService.get('GRPC_URL', '0.0.0.0:50052'),
    },
  });

  await app.startAllMicroservices();
  const httpPort = configService.get('HTTP_PORT', 3002);
  await app.listen(httpPort);
  
}

bootstrap();

import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Apply global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Setup gRPC microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'image',
      protoPath: join(__dirname, '../../proto/image.proto'),
      url: configService.get('GRPC_URL', '0.0.0.0:50052'),
    },
  });

  await app.startAllMicroservices();
  
  // Optional: Start HTTP server for health checks or debugging
  const httpPort = configService.get('HTTP_PORT', 3002);
  await app.listen(httpPort);
  
  console.log(`Image service is running on gRPC and HTTP port ${httpPort}`);
}

bootstrap();

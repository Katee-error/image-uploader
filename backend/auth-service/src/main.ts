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
      package: 'auth',
      protoPath: join(__dirname, '../../proto/auth.proto'),
      url: configService.get('GRPC_URL', '0.0.0.0:50051'),
    },
  });

  await app.startAllMicroservices();
  
  const httpPort = configService.get('HTTP_PORT', 3001);
  await app.listen(httpPort);
  
  console.log(`Auth service is running on gRPC and HTTP port ${httpPort}`);
}

bootstrap();

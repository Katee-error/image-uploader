import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'log', 'verbose'],
  });
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors({
    origin: configService.get('CORS_ORIGIN', '*'),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useWebSocketAdapter(new IoAdapter(app));

  const options = new DocumentBuilder()
    .setTitle('Image Processing API')
    .setDescription('API for image uploading and processing')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/docs', app, document);

  const port = configService.get('PORT', 3001);
  await app.listen(port);
  console.log(`API Gateway is running on port ${port}`);
  console.log(`JWT Secret: ${configService.get('JWT_SECRET')}`);
  console.log(`CORS Origin: ${configService.get('CORS_ORIGIN')}`);
  console.log(`Auth Service URL: ${configService.get('AUTH_SERVICE_URL')}`);
  console.log(`Image Service URL: ${configService.get('IMAGE_SERVICE_URL')}`);
}

bootstrap();

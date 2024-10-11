import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: false,
      forbidNonWhitelisted: true,
    }),
  );
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('List Management API')
    .setDescription("API for managing users and user's lists and list-items")
    .setVersion('1.0')
    .addBearerAuth() // Add JWT bearer token authentication
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document);

  await app.listen(3000);
}
bootstrap();

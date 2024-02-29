import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './core/interceptors/transfrom.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .setTitle('Manage Score')
    .setDescription('Backend writing in Node.js')
    .setVersion('0.1.0')
    .addServer(process.env.BASE_API_URL || '')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new TransformInterceptor());
  app.enableCors();
  SwaggerModule.setup('', app, document);
  await app.listen(8000);
}
bootstrap();

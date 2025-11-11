import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'dotenv/config';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { AppModule } from './modules/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Financial API Control')
    .setVersion('1.0')
    .addApiKey({
      type: 'apiKey',
      name: 'Authorization',
      description: 'Token de autenticação',
      in: 'header',
    }, 'Authorization')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  const document = documentFactory();

  Object.values(document.paths).forEach((path: any) => {
    Object.values(path).forEach((method: any) => {
      if (method.security === undefined) {
        method.security = [{ Authorization: [] }];
      }
    });
  });
  
  SwaggerModule.setup('api-docs', app, document);

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

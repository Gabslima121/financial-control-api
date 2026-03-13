import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'dotenv/config';
import { HttpExceptionFilter } from './utils/filters/http-exception.filter';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Financial API Control')
    .setVersion('1.0')
    .addApiKey(
      {
        type: 'apiKey',
        name: 'Authorization',
        description: 'Token de autenticação',
        in: 'header',
      },
      'Authorization',
    )
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  const document = documentFactory();

  const paths = document.paths;
  if (paths && typeof paths === 'object') {
    for (const [pathKey, pathItem] of Object.entries(
      paths as Record<string, unknown>,
    )) {
      if (!pathItem || typeof pathItem !== 'object') continue;

      for (const operation of Object.values(
        pathItem as Record<string, unknown>,
      )) {
        if (!operation || typeof operation !== 'object') continue;

        const operationObj = operation as { security?: unknown };
        if (operationObj.security === undefined) {
          operationObj.security = [{ Authorization: [] }];
        }
      }

      if (pathKey === '/user/login') {
        const post = (pathItem as Record<string, unknown>).post;
        if (post && typeof post === 'object') {
          (post as { security?: unknown }).security = [];
        }
      }
    }
  }

  SwaggerModule.setup('api-docs', app, document);

  app.enableCors();
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();

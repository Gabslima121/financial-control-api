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

  Object.entries(document.paths).forEach(([pathKey, pathItem]: [string, any]) => {
    Object.entries(pathItem).forEach(([methodKey, operation]: [string, any]) => {
      if (operation && operation.security === undefined) {
        operation.security = [{ Authorization: [] }];
      }
    });

    if (pathKey === '/user/login' && pathItem.post) {
      pathItem.post.security = [];
    }
  });

  SwaggerModule.setup('api-docs', app, document);

  app.enableCors();
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

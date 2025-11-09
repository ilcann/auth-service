import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './config/app.config';
import { SwaggerConfig } from './config/swagger.config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // ✅ Gerekli: DTO'ları otomatik transform et
      whitelist: true, // Tanımlı olmayan prop'ları sil
      forbidNonWhitelisted: true, // Tanımlı olmayan prop varsa hata fırlat
      transformOptions: {
        enableImplicitConversion: true, // ✅ Gerekli: Implicit type conversion
      },
    }),
  );

  const logger = new Logger('Bootstrap');

  app.use(cookieParser());

  const configService = app.get(ConfigService);
  const swaggerConfig = configService.get<SwaggerConfig>('swagger')!;
  const appConfig = configService.get<AppConfig>('app');
  app.setGlobalPrefix(appConfig!.globalPrefix!);

  if (swaggerConfig.isEnabled) {
    const config = new DocumentBuilder()
      .setTitle(swaggerConfig.title || 'API')
      .setDescription(swaggerConfig.description || 'API description')
      .setVersion(swaggerConfig.version || '1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        swaggerConfig.bearerName,
      )
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(swaggerConfig.path, app, document);
  }

  await app.listen(appConfig!.port, appConfig!.host);
  logger.debug(
    `🚀 Application "${appConfig!.name}" is running on: http://${appConfig!.host}:${appConfig!.port}/${appConfig!.globalPrefix}`,
  );
}
void bootstrap();

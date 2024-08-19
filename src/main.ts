import { NestFactory } from '@nestjs/core';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';

async function bootstrap() {
  /**
   * Create nest app
   */
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  /**
   * Enable global Validation Pipe
   */
  app.useGlobalPipes(
    new ValidationPipe({
      /**
       * Custom error messages
       */
      exceptionFactory(validationErrors) {
        return new BadRequestException(
          validationErrors.map(error => ({
            field: error.property,
            errors: [Object.values(error.constraints)],
          })),
        );
      },
    }),
  );

  /**
   * Enable cookie
   */
  app.use(cookieParser());

  /**
   * Enable static assets from uploads (images)
   */

  app.useStaticAssets(join(__dirname, '..', 'uploads'));

  /**
   * Launch the app
   */
  await app.listen(3000);
}
bootstrap();

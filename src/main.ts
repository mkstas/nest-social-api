import { NestFactory } from '@nestjs/core';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  /**
   * Create nest app
   */
  const app = await NestFactory.create(AppModule);

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
   * Launch the app
   */
  await app.listen(3000);
}
bootstrap();

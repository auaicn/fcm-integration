import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { config } from 'dotenv';

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  console.table({
    'process.env.DEVELOPMENT_ENVIRONMENT_SERVICE_ACCOUNT_KEY_FILE_PATH':
      process.env.DEVELOPMENT_ENVIRONMENT_SERVICE_ACCOUNT_KEY_FILE_PATH,
    'process.env.OPERATION_ENVIRONMENT_SERVICE_ACCOUNT_KEY_FILE_PATH':
      process.env.OPERATION_ENVIRONMENT_SERVICE_ACCOUNT_KEY_FILE_PATH,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

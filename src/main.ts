import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';

async function bootstrap() {
  const PORT = 3000;
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.useStaticAssets(path.join(__dirname, '../public'));

  await app.listen(PORT);
  console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
}
bootstrap();
  
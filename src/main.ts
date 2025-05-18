import {
  configCors,
  configGlobalInterceptors,
  configMiddlewares,
  configSecurity,
} from '@common/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  configCors(app);
  configMiddlewares(app);
  configSecurity(app);
  configGlobalInterceptors(app);

  await app.listen(8080);
}

bootstrap();

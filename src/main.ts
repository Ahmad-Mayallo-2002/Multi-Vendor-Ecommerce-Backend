import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { log } from 'console';
import { graphqlUploadExpress } from 'graphql-upload-ts';
import { ValidationPipe } from '@nestjs/common';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import { ResponseInterceptor } from './assets/interceptors/response.interceptor';
import { RequestTimerInterceptor } from './assets/interceptors/request-timer.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use('/webhook', bodyParser.raw({ type: 'application/json' }));
  log(`http://localhost:${process.env.PORT}`);
  app.use(graphqlUploadExpress({ maxFieldSize: 5_000_000, maxFiles: 100000 }));
  app.use(
    cors({
      origin: ['http://localhost:5173'],
      methods: ['GET', 'POST', 'DELETE', 'PATCH'],
      credentials: true,
    }),
  );
  app.useGlobalInterceptors(new RequestTimerInterceptor());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

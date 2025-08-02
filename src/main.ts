import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { log } from 'console';
import { graphqlUploadExpress } from 'graphql-upload-ts';
import { ValidationPipe } from '@nestjs/common';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import { RequestTimerInterceptor } from './common/interceptors/request-timer.interceptor';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

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
  app.useGlobalInterceptors(
    new RequestTimerInterceptor(),
    // new ResponseInterceptor(),
  );
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

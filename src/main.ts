import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { log } from 'console';
import { graphqlUploadExpress } from 'graphql-upload-ts';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import { RequestTimerInterceptor } from './common/interceptors/request-timer.interceptor';
import {
  addTransactionalDataSource,
  initializeTransactionalContext,
} from 'typeorm-transactional';
import { DataSource } from 'typeorm';
import helmet from 'helmet';

async function bootstrap() {
  initializeTransactionalContext();

  const app = await NestFactory.create(AppModule);
  addTransactionalDataSource(app.get(DataSource));

  app.use('/webhook', bodyParser.raw({ type: 'application/json' }));
  log(`http://localhost:${process.env.PORT}`);
  app.use(graphqlUploadExpress({ maxFieldSize: 5_000_000, maxFiles: 100000 }));
  app.enableCors({
    credential: true,
    origin: 'http://localhost:5173',
  });
  app.use(helmet());
  app.useGlobalInterceptors(new RequestTimerInterceptor());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

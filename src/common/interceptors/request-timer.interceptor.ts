import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { log } from 'console';
import { Observable, tap } from 'rxjs';

@Injectable()
export class RequestTimerInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const ctx = GqlExecutionContext.create(context);
    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() =>
          console.log(`${ctx.getHandler().name} Take ${Date.now() - now}ms`),
        ),
      );
  }
}

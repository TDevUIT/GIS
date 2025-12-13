import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { RequestContext } from '../utils/request-context.util';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const httpCtx = context.switchToHttp();
    const req = httpCtx.getRequest();
    const res = httpCtx.getResponse();

    const startedAt = Date.now();
    const requestId = RequestContext.getRequestId() || req.header?.('x-request-id');

    return next.handle().pipe(
      finalize(() => {
        const durationMs = Date.now() - startedAt;

        const payload = {
          level: 'info',
          msg: 'http_request',
          requestId,
          method: req.method,
          path: req.originalUrl || req.url,
          statusCode: res.statusCode,
          durationMs,
        };

        console.log(JSON.stringify(payload));
      }),
    );
  }
}

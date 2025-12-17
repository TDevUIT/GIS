/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../dto/api-response.dto';
import { Request } from 'express';
import { RequestContext } from '../utils/request-context.util';
import {
  RESPONSE_MESSAGE_KEY,
  SKIP_RESPONSE_TRANSFORM,
} from '../decorators/api-response.decorator';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse();
    const statusCode = response.statusCode;
    const traceId =
      RequestContext.getRequestId() ||
      (typeof request.header === 'function'
        ? request.header('x-request-id')
        : undefined);

    const skipTransform = this.reflector.getAllAndOverride<boolean>(
      SKIP_RESPONSE_TRANSFORM,
      [context.getHandler(), context.getClass()],
    );

    if (skipTransform) {
      return next.handle();
    }

    const customMessage = this.reflector.getAllAndOverride<string>(
      RESPONSE_MESSAGE_KEY,
      [context.getHandler(), context.getClass()],
    );

    return next.handle().pipe(
      map((data) => {
        if (data && typeof data === 'object' && 'data' in (data as any) && 'meta' in (data as any) && 'error' in (data as any)) {
          return data;
        }

        if (data instanceof ApiResponse) {
          return {
            data: (data as any).data,
            meta: {
              statusCode: (data as any).statusCode,
              success: (data as any).success,
              message: (data as any).message,
              timestamp: (data as any).timestamp || new Date().toISOString(),
              path: (data as any).path || request.url,
              traceId,
            },
            error: (data as any).success
              ? null
              : {
                  code: (data as any).error?.code,
                  message: (data as any).message,
                  details: (data as any).error?.details,
                  traceId,
                },
          };
        }

        return {
          data,
          meta: {
            statusCode,
            success: true,
            message: customMessage || 'Success',
            timestamp: new Date().toISOString(),
            path: request.url,
            traceId,
          },
          error: null,
        };
      }),
    );
  }
}

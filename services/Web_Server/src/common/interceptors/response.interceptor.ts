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
import {
  RESPONSE_MESSAGE_KEY,
  SKIP_RESPONSE_TRANSFORM,
} from '../decorators/api-response.decorator';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse();
    const statusCode = response.statusCode;

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
        if (data instanceof ApiResponse) {
          return data;
        }

        return new ApiResponse<T>({
          statusCode,
          success: true,
          message: customMessage || 'Success',
          data,
          timestamp: new Date().toISOString(),
          path: request.url,
        });
      }),
    );
  }
}

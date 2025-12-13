import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { ApiResponse } from '../dto/api-response.dto';
import { RequestContext } from '../utils/request-context.util';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const traceId =
      RequestContext.getRequestId() ||
      (typeof request.header === 'function'
        ? request.header('x-request-id')
        : undefined);

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errorCode: string | undefined;
    let errorDetails: any;

    const isApiResponseShape = (v: any): v is ApiResponse<any> => {
      return (
        v &&
        typeof v === 'object' &&
        typeof (v as any).statusCode === 'number' &&
        typeof (v as any).success === 'boolean' &&
        'message' in v
      );
    };

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (isApiResponseShape(exceptionResponse)) {
        response.status(status).json({
          data: (exceptionResponse as any).data ?? null,
          meta: {
            statusCode: status,
            success: false,
            message: (exceptionResponse as any).message || message,
            timestamp: (exceptionResponse as any).timestamp || new Date().toISOString(),
            path: (exceptionResponse as any).path || request.url,
            traceId,
          },
          error: {
            code: (exceptionResponse as any).error?.code,
            message: (exceptionResponse as any).message || message,
            details: (exceptionResponse as any).error?.details,
            traceId,
          },
        });
        return;
      }

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const extractedMessage = (exceptionResponse as any).message;
        message =
          (Array.isArray(extractedMessage)
            ? extractedMessage.join(', ')
            : extractedMessage) || message;

        if ((exceptionResponse as any).error && typeof (exceptionResponse as any).error === 'object') {
          errorCode = (exceptionResponse as any).error.code;
          errorDetails = (exceptionResponse as any).error.details;
        } else {
          errorCode =
            (exceptionResponse as any).error !== undefined
              ? String((exceptionResponse as any).error)
              : undefined;
          errorDetails = (exceptionResponse as any).details;
        }
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      errorCode = 'INTERNAL_ERROR';
      errorDetails = exception.stack;
    }

    response.status(status).json({
      data: null,
      meta: {
        statusCode: status,
        success: false,
        message,
        timestamp: new Date().toISOString(),
        path: request.url,
        traceId,
      },
      error: {
        code: errorCode || 'INTERNAL_ERROR',
        message,
        details: errorDetails,
        traceId,
      },
    });
  }
}

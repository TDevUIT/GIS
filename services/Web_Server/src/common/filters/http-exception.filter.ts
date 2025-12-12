import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { ApiResponse } from '../dto/api-response.dto';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error: any = {};

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
        response.status(status).json(exceptionResponse);
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
        error =
          (exceptionResponse as any).error !== undefined ||
          (exceptionResponse as any).details !== undefined
            ? {
                code: (exceptionResponse as any).error,
                details: (exceptionResponse as any).details,
              }
            : exceptionResponse;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      error = {
        code: 'INTERNAL_ERROR',
        details: exception.stack,
      };
    }

    const errorResponse = new ApiResponse({
      statusCode: status,
      success: false,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
    });

    response.status(status).json(errorResponse);
  }
}

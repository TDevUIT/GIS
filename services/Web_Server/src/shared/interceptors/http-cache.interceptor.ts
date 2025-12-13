/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CacheInterceptor } from '@nestjs/cache-manager';
import { ExecutionContext, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
  private readonly logger = new Logger(HttpCacheInterceptor.name);

  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest();
    const { httpAdapter } = this.httpAdapterHost;

    const isGetRequest = httpAdapter.getRequestMethod(request) === 'GET';
    if (!isGetRequest) {
      return undefined;
    }

    const key = httpAdapter.getRequestUrl(request);
    this.logger.log(`🔍 Cache Key Generated: ${key}`);

    return key;
  }
}

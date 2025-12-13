import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import { RequestContext } from 'src/shared/utils/request-context.util';

@Injectable()
export class GisClientService {
  private readonly baseUrl: string;

  private consecutiveFailures = 0;
  private circuitOpenUntilMs = 0;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const url = this.configService.get<string>('GIS_SERVER_URL');
    if (!url) {
      throw new Error('GIS_SERVER_URL is not defined in environment variables');
    }
    this.baseUrl = url;
  }

  private getDefaultTimeoutMs(path: string) {
    if (path.startsWith('/analytics')) {
      return 12000;
    }

    if (
      path.startsWith('/accidents') ||
      path.startsWith('/infrastructures')
    ) {
      return 20000;
    }

    return 8000;
  }

  private isRetryableError(error: AxiosError) {
    if (!error) return false;

    if (!error.response) {
      return true;
    }

    const status = error.response.status;
    return status === 502 || status === 503 || status === 504;
  }

  private getTraceIdFromContext() {
    return RequestContext.getRequestId();
  }

  private getCircuitBreakerState() {
    const now = Date.now();
    if (this.circuitOpenUntilMs > now) {
      return { open: true, openUntilMs: this.circuitOpenUntilMs };
    }
    return { open: false, openUntilMs: 0 };
  }

  private recordSuccess() {
    this.consecutiveFailures = 0;
    this.circuitOpenUntilMs = 0;
  }

  private recordFailure() {
    this.consecutiveFailures += 1;

    const failureThreshold = 5;
    const openDurationMs = 30_000;

    if (this.consecutiveFailures >= failureThreshold) {
      this.circuitOpenUntilMs = Date.now() + openDurationMs;
    }
  }

  private toGatewayHttpException(error: AxiosError) {
    const status = error.response?.status || 502;
    const data = error.response?.data as any;

    const message =
      (typeof data === 'object' && data && (data.message as string)) ||
      (typeof data === 'string' && data) ||
      error.message ||
      'An internal error occurred in the GIS Server';

    const traceId = this.getTraceIdFromContext();

    return new HttpException(
      {
        message,
        error: {
          code: 'GIS_SERVER_ERROR',
          details: data,
          traceId,
        },
      },
      status,
    );
  }

  private buildUrl(path: string) {
    if (!path.startsWith('/')) {
      return `${this.baseUrl}/${path}`;
    }
    return `${this.baseUrl}${path}`;
  }

  private async requestWithResilience<T = any>(
    method: 'get' | 'post' | 'patch' | 'delete',
    path: string,
    body?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const circuit = this.getCircuitBreakerState();
    if (circuit.open) {
      throw new HttpException(
        {
          message: 'GIS Server temporarily unavailable (circuit open)',
          error: {
            code: 'GIS_CIRCUIT_OPEN',
            details: { openUntilMs: circuit.openUntilMs },
            traceId: this.getTraceIdFromContext(),
          },
        },
        503,
      );
    }

    const traceId = this.getTraceIdFromContext();

    const mergedConfig: AxiosRequestConfig = {
      ...(config || {}),
      timeout: config?.timeout ?? this.getDefaultTimeoutMs(path),
      headers: {
        ...(config?.headers || {}),
        ...(traceId ? { 'x-request-id': traceId } : {}),
      },
    };

    const maxRetries = 2;
    const baseDelayMs = 200;

    for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
      try {
        let response: AxiosResponse<T>;

        if (method === 'get') {
          response = await firstValueFrom(
            this.httpService.get<T>(this.buildUrl(path), mergedConfig),
          );
        } else if (method === 'post') {
          response = await firstValueFrom(
            this.httpService.post<T>(this.buildUrl(path), body, mergedConfig),
          );
        } else if (method === 'patch') {
          response = await firstValueFrom(
            this.httpService.patch<T>(this.buildUrl(path), body, mergedConfig),
          );
        } else {
          response = await firstValueFrom(
            this.httpService.delete<T>(this.buildUrl(path), mergedConfig),
          );
        }

        this.recordSuccess();
        return response.data;
      } catch (e: any) {
        const axiosError = e as AxiosError;

        if (attempt < maxRetries && this.isRetryableError(axiosError)) {
          const delayMs = baseDelayMs * Math.pow(2, attempt);
          await new Promise((resolve) => setTimeout(resolve, delayMs));
          continue;
        }

        this.recordFailure();

        if (axiosError && (axiosError as any).isAxiosError) {
          throw this.toGatewayHttpException(axiosError);
        }

        throw e;
      }
    }

    throw new HttpException(
      {
        message: 'Unexpected GIS client error',
        error: {
          code: 'GIS_CLIENT_ERROR',
          details: null,
          traceId,
        },
      },
      500,
    );
  }

  async get<T = any>(path: string, config?: AxiosRequestConfig) {
    return this.requestWithResilience<T>('get', path, undefined, config);
  }

  async post<T = any>(path: string, body?: any, config?: AxiosRequestConfig) {
    return this.requestWithResilience<T>('post', path, body, config);
  }

  async patch<T = any>(path: string, body?: any, config?: AxiosRequestConfig) {
    return this.requestWithResilience<T>('patch', path, body, config);
  }

  async delete<T = any>(path: string, config?: AxiosRequestConfig) {
    return this.requestWithResilience<T>('delete', path, undefined, config);
  }
}

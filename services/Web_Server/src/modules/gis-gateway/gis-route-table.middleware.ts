import { Injectable, NestMiddleware } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import type { NextFunction, Request, Response } from 'express';
import type { RawAxiosRequestHeaders } from 'axios';
import { firstValueFrom } from 'rxjs';

const GIS_PREFIXES = new Set([
  'districts',
  'wards',
  'infrastructures',
  'accidents',
  'traffics',
  'public-transports',
  'land-uses',
  'urban-plans',
  'terrains',
  'air-qualities',
  'water-qualities',
  'populations',
  'analytics',
]);

function getFirstSegmentAfterApiV1(pathname: string) {
  if (!pathname.startsWith('/api/v1/')) return undefined;
  const rest = pathname.slice('/api/v1/'.length);
  const seg = rest.split('/')[0];
  return seg || undefined;
}

function shouldStreamBody(req: Request) {
  const contentType = req.headers['content-type'];
  if (typeof contentType !== 'string') return false;
  return (
    contentType.startsWith('multipart/form-data') ||
    contentType.startsWith('application/octet-stream')
  );
}

@Injectable()
export class GisRouteTableMiddleware implements NestMiddleware {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const first = getFirstSegmentAfterApiV1(req.path);
    if (!first || !GIS_PREFIXES.has(first)) {
      return next();
    }

    const baseUrl = this.configService.get<string>('GIS_SERVER_URL');
    if (!baseUrl) {
      return res.status(500).json({ message: 'GIS_SERVER_URL is not configured' });
    }

    const url = `${baseUrl}${req.originalUrl}`;

    const headers: RawAxiosRequestHeaders = {
      ...(req.headers as unknown as RawAxiosRequestHeaders),
    };
    delete (headers as any).host;

    const data = shouldStreamBody(req) ? (req as any) : req.body;

    const axiosResponse = await firstValueFrom(
      this.httpService.request({
        url,
        method: req.method as any,
        headers,
        data,
        responseType: 'arraybuffer',
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
        validateStatus: () => true,
      }),
    );

    Object.entries(axiosResponse.headers || {}).forEach(([key, value]) => {
      const lower = key.toLowerCase();
      if (
        lower === 'transfer-encoding' ||
        lower === 'content-encoding' ||
        lower === 'content-length' ||
        lower === 'connection'
      ) {
        return;
      }
      if (typeof value !== 'undefined') {
        res.setHeader(key, value as any);
      }
    });

    return res.status(axiosResponse.status).send(axiosResponse.data);
  }
}

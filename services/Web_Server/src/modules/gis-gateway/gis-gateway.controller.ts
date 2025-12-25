import { Controller, All, Req, Res } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import type { RawAxiosRequestHeaders } from 'axios';
import { firstValueFrom } from 'rxjs';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('GIS Gateway')
@Controller('gis')
export class GisGatewayController {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  @ApiOperation({
    summary: 'Proxy to GIS Server',
    description: 'Forwards all requests starting with /api/v1/gis to the GIS Server.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful response from GIS Server.',
  })
  @All('*')
  async proxy(@Req() req: Request, @Res() res: Response) {
    const baseUrl = this.configService.get<string>('GIS_SERVER_URL');
    if (!baseUrl) {
      return res.status(500).json({ message: 'GIS_SERVER_URL is not configured' });
    }

    const url = `${baseUrl}/api/v1${req.url}`;

    const headers: RawAxiosRequestHeaders = {
      ...(req.headers as unknown as RawAxiosRequestHeaders),
    };

    delete (headers as any).host;

    let axiosResponse: any;
    try {
      axiosResponse = await firstValueFrom(
        this.httpService.request({
          url,
          method: req.method as any,
          headers,
          params: req.query,
          data: req.body,
          responseType: 'arraybuffer',
          validateStatus: () => true,
        }),
      );
    } catch {
      return res.status(502).json({
        message: 'Failed to proxy request to GIS server',
        url,
      });
    }

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

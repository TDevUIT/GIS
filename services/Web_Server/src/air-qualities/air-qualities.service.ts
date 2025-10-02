/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, catchError, throwError } from 'rxjs';
import { AxiosError } from 'axios';
import { ConfigService } from '@nestjs/config';

interface FindAirQualityQuery {
  districtId?: string;
  from?: string;
  to?: string;
}

@Injectable()
export class AirQualitiesService {
  private readonly gisServerUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const url = this.configService.get<string>('GIS_SERVER_URL');
    if (!url) {
      throw new Error('GIS_SERVER_URL is not defined in environment variables');
    }
    this.gisServerUrl = url;
  }

  private handleError(error: AxiosError) {
    console.error('Error from GIS Server:', error.response?.data);
    return throwError(
      () =>
        new HttpException(
          error.response?.data ||
            'An internal error occurred in the GIS Server',
          error.response?.status || 500,
        ),
    );
  }

  async create(createDto: any) {
    const url = `${this.gisServerUrl}/air-qualities`;
    const response = await firstValueFrom(
      this.httpService.post(url, createDto).pipe(catchError(this.handleError)),
    );
    return response.data;
  }

  async findAll(query: FindAirQualityQuery) {
    const url = `${this.gisServerUrl}/air-qualities`;
    const response = await firstValueFrom(
      this.httpService
        .get(url, { params: query })
        .pipe(catchError(this.handleError)),
    );
    return response.data;
  }

  async findOne(id: string) {
    const url = `${this.gisServerUrl}/air-qualities/${id}`;
    const response = await firstValueFrom(
      this.httpService.get(url).pipe(catchError(this.handleError)),
    );
    return response.data;
  }

  async update(id: string, updateDto: any) {
    const url = `${this.gisServerUrl}/air-qualities/${id}`;
    const response = await firstValueFrom(
      this.httpService.patch(url, updateDto).pipe(catchError(this.handleError)),
    );
    return response.data;
  }

  async remove(id: string) {
    const url = `${this.gisServerUrl}/air-qualities/${id}`;
    const response = await firstValueFrom(
      this.httpService.delete(url).pipe(catchError(this.handleError)),
    );
    return response.data;
  }

  async findWithinRadius(lng: string, lat: string, radiusInMeters: string) {
    const url = `${this.gisServerUrl}/air-qualities/within-radius`;
    const response = await firstValueFrom(
      this.httpService
        .get(url, { params: { lng, lat, radiusInMeters } })
        .pipe(catchError(this.handleError)),
    );
    return response.data;
  }
}

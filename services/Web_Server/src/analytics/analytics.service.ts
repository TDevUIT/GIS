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

@Injectable()
export class AnalyticsService {
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

  async getGlobalSummary() {
    const url = `${this.gisServerUrl}/analytics/summary`;
    const response = await firstValueFrom(
      this.httpService.get(url).pipe(catchError(this.handleError)),
    );
    return response.data;
  }

  async getInfrastructureByCategory() {
    const url = `${this.gisServerUrl}/analytics/infrastructure-by-category`;
    const response = await firstValueFrom(
      this.httpService.get(url).pipe(catchError(this.handleError)),
    );
    return response.data;
  }

  async getPopulationHistory(districtId: string) {
    const url = `${this.gisServerUrl}/analytics/population-history/${districtId}`;
    const response = await firstValueFrom(
      this.httpService.get(url).pipe(catchError(this.handleError)),
    );
    return response.data;
  }

  async getLandUseSummary(districtId: string, year?: number) {
    const url = `${this.gisServerUrl}/analytics/land-use-summary`;
    const response = await firstValueFrom(
      this.httpService
        .get(url, { params: { districtId, year } })
        .pipe(catchError(this.handleError)),
    );
    return response.data;
  }

  async getAirQualityHistory(districtId: string) {
    const url = `${this.gisServerUrl}/analytics/air-quality-history/${districtId}`;
    const response = await firstValueFrom(
      this.httpService.get(url).pipe(catchError(this.handleError)),
    );
    return response.data;
  }

  async getAccidentSummaryBySeverity() {
    const url = `${this.gisServerUrl}/analytics/accident-summary-by-severity`;
    const response = await firstValueFrom(
      this.httpService.get(url).pipe(catchError(this.handleError)),
    );
    return response.data;
  }
}

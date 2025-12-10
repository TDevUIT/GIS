/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, HttpException, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, catchError, throwError } from 'rxjs';
import { AxiosError } from 'axios';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class AnalyticsService {
  private readonly gisServerUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
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

  async testRedisConnection() {
    console.log('🔄 Bắt đầu test Redis Cache thủ công...');
    try {
      await this.cacheManager.set(
        'test_manual_key',
        'Redis hoạt động ngon lành!',
        60000,
      );
      console.log('✅ Đã set key: test_manual_key');
      const value = await this.cacheManager.get('test_manual_key');
      console.log('✅ Đã get key: test_manual_key -> Value:', value);
      const stores = this.cacheManager.stores;
      const store = stores[0] as any;
      const client = store?.client || store?.options?.client;
      if (client) {
        console.log(
          'ℹ️ Redis Client Status:',
          client.isOpen ? 'Open' : 'Closed',
        );
      }

      return {
        message: 'Redis Test Successful',
        cachedValue: value,
        backend: 'Redis',
      };
    } catch (error) {
      console.error('❌ Lỗi kết nối Redis Cache:', error);
      return {
        message: 'Redis Test Failed',
        error: error.message,
      };
    }
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

  async getWaterQualityHistory(districtId: string) {
    const url = `${this.gisServerUrl}/analytics/water-quality-history/${districtId}`;
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

  async getRecentActivities() {
    const url = `${this.gisServerUrl}/analytics/recent-activities`;
    const response = await firstValueFrom(
      this.httpService.get(url).pipe(catchError(this.handleError)),
    );
    return response.data;
  }

  async getDemographicsSummary(populationId: string) {
    const url = `${this.gisServerUrl}/analytics/demographics-summary/${populationId}`;
    const response = await firstValueFrom(
      this.httpService.get(url).pipe(catchError(this.handleError)),
    );
    return response.data;
  }

  async getHouseholdsSummary(populationId: string) {
    const url = `${this.gisServerUrl}/analytics/households-summary/${populationId}`;
    const response = await firstValueFrom(
      this.httpService.get(url).pipe(catchError(this.handleError)),
    );
    return response.data;
  }

  async getAccidentHotspots() {
    const url = `${this.gisServerUrl}/analytics/accident-hotspots`;
    const response = await firstValueFrom(
      this.httpService.get(url).pipe(catchError(this.handleError)),
    );
    return response.data;
  }

  async getAccidentsByTimeOfDay() {
    const url = `${this.gisServerUrl}/analytics/accidents-by-time-of-day`;
    const response = await firstValueFrom(
      this.httpService.get(url).pipe(catchError(this.handleError)),
    );
    return response.data;
  }

  async getAccidentsByDayOfWeek() {
    const url = `${this.gisServerUrl}/analytics/accidents-by-day-of-week`;
    const response = await firstValueFrom(
      this.httpService.get(url).pipe(catchError(this.handleError)),
    );
    return response.data;
  }

  async getTrafficRiskAssessment() {
    const url = `${this.gisServerUrl}/analytics/traffic-risk-assessment`;
    const response = await firstValueFrom(
      this.httpService.get(url).pipe(catchError(this.handleError)),
    );
    return response.data;
  }

  async getPublicTransportSummaryByMode() {
    const url = `${this.gisServerUrl}/analytics/public-transport-summary-by-mode`;
    const response = await firstValueFrom(
      this.httpService.get(url).pipe(catchError(this.handleError)),
    );
    return response.data;
  }

  async getPublicTransportCapacityByMode() {
    const url = `${this.gisServerUrl}/analytics/public-transport-capacity-by-mode`;
    const response = await firstValueFrom(
      this.httpService.get(url).pipe(catchError(this.handleError)),
    );
    return response.data;
  }

  async getMostFrequentRoutes() {
    const url = `${this.gisServerUrl}/analytics/most-frequent-routes`;
    const response = await firstValueFrom(
      this.httpService.get(url).pipe(catchError(this.handleError)),
    );
    return response.data;
  }

  async getAirQualityRankingByDistrict() {
    const url = `${this.gisServerUrl}/analytics/air-quality-ranking-by-district`;
    const response = await firstValueFrom(
      this.httpService.get(url).pipe(catchError(this.handleError)),
    );
    return response.data;
  }

  async getWaterQualityRankingByDistrict() {
    const url = `${this.gisServerUrl}/analytics/water-quality-ranking-by-district`;
    const response = await firstValueFrom(
      this.httpService.get(url).pipe(catchError(this.handleError)),
    );
    return response.data;
  }

  async getTerrainSummaryByDistrict() {
    const url = `${this.gisServerUrl}/analytics/terrain-summary-by-district`;
    const response = await firstValueFrom(
      this.httpService.get(url).pipe(catchError(this.handleError)),
    );
    return response.data;
  }

  async getLandslideRiskAreas(slopeThreshold?: number) {
    const url = `${this.gisServerUrl}/analytics/landslide-risk-areas`;
    const response = await firstValueFrom(
      this.httpService
        .get(url, { params: { slopeThreshold } })
        .pipe(catchError(this.handleError)),
    );
    return response.data;
  }

  async getFloodProneAreas(elevationThreshold?: number) {
    const url = `${this.gisServerUrl}/analytics/flood-prone-areas`;
    const response = await firstValueFrom(
      this.httpService
        .get(url, { params: { elevationThreshold } })
        .pipe(catchError(this.handleError)),
    );
    return response.data;
  }

  async getSoilTypeDistribution() {
    const url = `${this.gisServerUrl}/analytics/soil-type-distribution`;
    const response = await firstValueFrom(
      this.httpService.get(url).pipe(catchError(this.handleError)),
    );
    return response.data;
  }
}

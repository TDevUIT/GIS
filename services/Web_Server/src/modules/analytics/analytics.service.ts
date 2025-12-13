/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { GisClientService } from 'src/infra/gis-client/gis-client.service';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly gisClient: GisClientService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

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
    return this.gisClient.get('/analytics/summary');
  }

  async getInfrastructureByCategory() {
    return this.gisClient.get('/analytics/infrastructure-by-category');
  }

  async getPopulationHistory(districtId: string) {
    return this.gisClient.get(`/analytics/population-history/${districtId}`);
  }

  async getLandUseSummary(districtId: string, year?: number) {
    return this.gisClient.get('/analytics/land-use-summary', {
      params: { districtId, year },
    });
  }

  async getAirQualityHistory(districtId: string) {
    return this.gisClient.get(`/analytics/air-quality-history/${districtId}`);
  }

  async getWaterQualityHistory(districtId: string) {
    return this.gisClient.get(`/analytics/water-quality-history/${districtId}`);
  }

  async getAccidentSummaryBySeverity() {
    return this.gisClient.get('/analytics/accident-summary-by-severity');
  }

  async getRecentActivities() {
    return this.gisClient.get('/analytics/recent-activities');
  }

  async getDemographicsSummary(populationId: string) {
    return this.gisClient.get(`/analytics/demographics-summary/${populationId}`);
  }

  async getHouseholdsSummary(populationId: string) {
    return this.gisClient.get(`/analytics/households-summary/${populationId}`);
  }

  async getAccidentHotspots() {
    return this.gisClient.get('/analytics/accident-hotspots');
  }

  async getAccidentsByTimeOfDay() {
    return this.gisClient.get('/analytics/accidents-by-time-of-day');
  }

  async getAccidentsByDayOfWeek() {
    return this.gisClient.get('/analytics/accidents-by-day-of-week');
  }

  async getTrafficRiskAssessment() {
    return this.gisClient.get('/analytics/traffic-risk-assessment');
  }

  async getPublicTransportSummaryByMode() {
    return this.gisClient.get('/analytics/public-transport-summary-by-mode');
  }

  async getPublicTransportCapacityByMode() {
    return this.gisClient.get('/analytics/public-transport-capacity-by-mode');
  }

  async getMostFrequentRoutes() {
    return this.gisClient.get('/analytics/most-frequent-routes');
  }

  async getAirQualityRankingByDistrict() {
    return this.gisClient.get('/analytics/air-quality-ranking-by-district');
  }

  async getWaterQualityRankingByDistrict() {
    return this.gisClient.get('/analytics/water-quality-ranking-by-district');
  }

  async getTerrainSummaryByDistrict() {
    return this.gisClient.get('/analytics/terrain-summary-by-district');
  }

  async getLandslideRiskAreas(slopeThreshold?: number) {
    return this.gisClient.get('/analytics/landslide-risk-areas', {
      params: { slopeThreshold },
    });
  }

  async getFloodProneAreas(elevationThreshold?: number) {
    return this.gisClient.get('/analytics/flood-prone-areas', {
      params: { elevationThreshold },
    });
  }

  async getSoilTypeDistribution() {
    return this.gisClient.get('/analytics/soil-type-distribution');
  }
}

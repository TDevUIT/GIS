/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { GisClientService } from 'src/infra/gis-client/gis-client.service';
import { GisEndpoints } from 'src/infra/gis-client/gis-endpoints';

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
    return this.gisClient.get(GisEndpoints.analytics.summary);
  }

  async getInfrastructureByCategory() {
    return this.gisClient.get(GisEndpoints.analytics.infrastructureByCategory);
  }

  async getPopulationHistory(districtId: string) {
    return this.gisClient.get(GisEndpoints.analytics.populationHistory(districtId));
  }

  async getLandUseSummary(districtId: string, year?: number) {
    return this.gisClient.get(GisEndpoints.analytics.landUseSummary, {
      params: { districtId, year },
    });
  }

  async getAirQualityHistory(districtId: string) {
    return this.gisClient.get(GisEndpoints.analytics.airQualityHistory(districtId));
  }

  async getWaterQualityHistory(districtId: string) {
    return this.gisClient.get(GisEndpoints.analytics.waterQualityHistory(districtId));
  }

  async getAccidentSummaryBySeverity() {
    return this.gisClient.get(GisEndpoints.analytics.accidentSummaryBySeverity);
  }

  async getRecentActivities() {
    return this.gisClient.get(GisEndpoints.analytics.recentActivities);
  }

  async getDemographicsSummary(populationId: string) {
    return this.gisClient.get(GisEndpoints.analytics.demographicsSummary(populationId));
  }

  async getHouseholdsSummary(populationId: string) {
    return this.gisClient.get(GisEndpoints.analytics.householdsSummary(populationId));
  }

  async getAccidentHotspots() {
    return this.gisClient.get(GisEndpoints.analytics.accidentHotspots);
  }

  async getAccidentsByTimeOfDay() {
    return this.gisClient.get(GisEndpoints.analytics.accidentsByTimeOfDay);
  }

  async getAccidentsByDayOfWeek() {
    return this.gisClient.get(GisEndpoints.analytics.accidentsByDayOfWeek);
  }

  async getTrafficRiskAssessment() {
    return this.gisClient.get(GisEndpoints.analytics.trafficRiskAssessment);
  }

  async getPublicTransportSummaryByMode() {
    return this.gisClient.get(GisEndpoints.analytics.publicTransportSummaryByMode);
  }

  async getPublicTransportCapacityByMode() {
    return this.gisClient.get(GisEndpoints.analytics.publicTransportCapacityByMode);
  }

  async getMostFrequentRoutes() {
    return this.gisClient.get(GisEndpoints.analytics.mostFrequentRoutes);
  }

  async getAirQualityRankingByDistrict() {
    return this.gisClient.get(GisEndpoints.analytics.airQualityRankingByDistrict);
  }

  async getWaterQualityRankingByDistrict() {
    return this.gisClient.get(GisEndpoints.analytics.waterQualityRankingByDistrict);
  }

  async getTerrainSummaryByDistrict() {
    return this.gisClient.get(GisEndpoints.analytics.terrainSummaryByDistrict);
  }

  async getLandslideRiskAreas(slopeThreshold?: number) {
    return this.gisClient.get(GisEndpoints.analytics.landslideRiskAreas, {
      params: { slopeThreshold },
    });
  }

  async getFloodProneAreas(elevationThreshold?: number) {
    return this.gisClient.get(GisEndpoints.analytics.floodProneAreas, {
      params: { elevationThreshold },
    });
  }

  async getSoilTypeDistribution() {
    return this.gisClient.get(GisEndpoints.analytics.soilTypeDistribution);
  }
}

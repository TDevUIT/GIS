import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { AnalyticsRepository } from './analytics.repository';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly repository: AnalyticsRepository,
  ) {}

  async getGlobalSummary() {
    const [districtCount, infraCount, roadCount, planCount, latestPopulation] =
      await this.prisma.$transaction([
        this.prisma.district.count(),
        this.prisma.infrastructure.count(),
        this.prisma.traffic.count(),
        this.prisma.urbanPlan.count(),
        this.prisma.population.findFirst({ orderBy: { year: 'desc' } }),
      ]);
    return {
      totalDistricts: districtCount,
      totalInfrastructures: infraCount,
      totalTrafficRoutes: roadCount,
      totalUrbanPlans: planCount,
      latestPopulationData: {
        year: latestPopulation?.year || null,
        total: latestPopulation?.populationTotal || 0,
      },
    };
  }

  async getInfrastructureByCategory() {
    return this.repository.getInfrastructureByCategory();
  }

  async getPopulationHistory(districtId: string) {
    const district = await this.prisma.district.findUnique({
      where: { id: districtId },
    });
    if (!district) {
      throw new NotFoundException(`Quận với ID "${districtId}" không tồn tại.`);
    }
    return this.repository.getPopulationHistory(districtId);
  }

  async getLandUseSummary(districtId: string, year?: number) {
    const district = await this.prisma.district.findUnique({
      where: { id: districtId },
    });
    if (!district) {
      throw new NotFoundException(`Quận với ID "${districtId}" không tồn tại.`);
    }
    const targetYear =
      year ||
      (
        await this.prisma.landUse.findFirst({
          where: { districtId },
          orderBy: { year: 'desc' },
        })
      )?.year;
    if (!targetYear) {
      return { year: null, summary: [] };
    }
    const summary = await this.repository.getLandUseSummary(districtId, targetYear);
    return { year: targetYear, summary };
  }

  async getAirQualityHistory(districtId: string) {
    const district = await this.prisma.district.findUnique({
      where: { id: districtId },
    });
    if (!district) {
      throw new NotFoundException(`Quận với ID "${districtId}" không tồn tại.`);
    }
    return this.repository.getAirQualityHistory(districtId);
  }

  async getAccidentSummaryBySeverity() {
    return this.repository.getAccidentSummaryBySeverity();
  }

  async getWaterQualityHistory(districtId: string) {
    const district = await this.prisma.district.findUnique({
      where: { id: districtId },
    });
    if (!district)
      throw new NotFoundException(`Quận với ID "${districtId}" không tồn tại.`);
    return this.repository.getWaterQualityHistory(districtId);
  }

  async getRecentActivities() {
    const recentInfrastructures = this.prisma.infrastructure.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, category: true, createdAt: true },
    });
    const recentAccidents = this.prisma.accident.findMany({
      take: 2,
      orderBy: { accidentDate: 'desc' },
      select: { id: true, severity: true, accidentDate: true },
    });
    const [infras, accidents] = await Promise.all([
      recentInfrastructures,
      recentAccidents,
    ]);
    const activities = [
      ...infras.map((item) => ({ type: 'INFRASTRUCTURE', ...item })),
      ...accidents.map((item) => ({
        type: 'ACCIDENT',
        ...item,
        createdAt: item.accidentDate,
      })),
    ].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    return activities.slice(0, 5);
  }
  async getDemographicsSummary(populationId: string) {
    const populationExists = await this.prisma.population.findUnique({
      where: { id: populationId },
    });
    if (!populationExists) {
      throw new NotFoundException(
        `Dữ liệu dân số với ID "${populationId}" không tồn tại.`,
      );
    }
    return this.repository.getDemographicsSummary(populationId);
  }

  async getHouseholdsSummary(populationId: string) {
    const populationExists = await this.prisma.population.findUnique({
      where: { id: populationId },
    });
    if (!populationExists) {
      throw new NotFoundException(
        `Dữ liệu dân số với ID "${populationId}" không tồn tại.`,
      );
    }
    return this.repository.getHouseholdsSummary(populationId);
  }
  async getAccidentHotspots(limit = 5) {
    return this.repository.getAccidentHotspots(limit);
  }
  async getAccidentsByTimeOfDay() {
    return this.repository.getAccidentsByTimeOfDay();
  }
  async getAccidentsByDayOfWeek() {
    return this.repository.getAccidentsByDayOfWeek();
  }
  async getTrafficRiskAssessment() {
    return this.repository.getTrafficRiskAssessment();
  }
  async getPublicTransportSummaryByMode() {
    return this.repository.getPublicTransportSummaryByMode();
  }
  async getPublicTransportCapacityByMode() {
    return this.repository.getPublicTransportCapacityByMode();
  }
  async getMostFrequentRoutes(limit = 5) {
    return this.repository.getMostFrequentRoutes(limit);
  }

  async getAirQualityRankingByDistrict() {
    return this.repository.getAirQualityRankingByDistrict();
  }

  async getWaterQualityRankingByDistrict() {
    return this.repository.getWaterQualityRankingByDistrict();
  }

  async getTerrainSummaryByDistrict() {
    return this.repository.getTerrainSummaryByDistrict();
  }
  async getLandslideRiskAreas(slopeThreshold: number = 15) {
    return this.repository.getLandslideRiskAreas(slopeThreshold);
  }
  async getFloodProneAreas(elevationThreshold: number = 2) {
    return this.repository.getFloodProneAreas(elevationThreshold);
  }
  async getSoilTypeDistribution() {
    return this.repository.getSoilTypeDistribution();
  }
}

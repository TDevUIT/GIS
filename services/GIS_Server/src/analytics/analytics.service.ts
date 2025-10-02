import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

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
    const query = Prisma.sql`
      SELECT 
        category, 
        COUNT(id)::int as "count"
      FROM "public"."infrastructures"
      GROUP BY category
      ORDER BY "count" DESC;
    `;
    return this.prisma.$queryRaw(query);
  }

  async getPopulationHistory(districtId: string) {
    const district = await this.prisma.district.findUnique({
      where: { id: districtId },
    });
    if (!district) {
      throw new NotFoundException(`Quận với ID "${districtId}" không tồn tại.`);
    }
    const query = Prisma.sql`
      SELECT 
        year, 
        population_total as "populationTotal",
        households_total as "householdsTotal"
      FROM "public"."populations"
      WHERE "districtId" = ${districtId}
      ORDER BY year ASC;
    `;
    return this.prisma.$queryRaw(query);
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
    const query = Prisma.sql`
      SELECT 
        type, 
        SUM(area_km2) as "totalAreaKm2"
      FROM "public"."land_uses"
      WHERE "districtId" = ${districtId} AND year = ${targetYear}::integer
      GROUP BY type
      ORDER BY "totalAreaKm2" DESC;
    `;
    const summary = await this.prisma.$queryRaw(query);
    return { year: targetYear, summary };
  }

  async getAirQualityHistory(districtId: string) {
    const district = await this.prisma.district.findUnique({
      where: { id: districtId },
    });
    if (!district) {
      throw new NotFoundException(`Quận với ID "${districtId}" không tồn tại.`);
    }
    const query = Prisma.sql`
      SELECT 
        DATE_TRUNC('month', recorded_at)::date as "month",
        ROUND(AVG(pm25)::numeric, 2) as "avgPm25",
        ROUND(AVG(co2)::numeric, 2) as "avgCo2"
      FROM "public"."air_qualities"
      WHERE "districtId" = ${districtId} AND pm25 IS NOT NULL
      GROUP BY "month"
      ORDER BY "month" ASC;
    `;
    return this.prisma.$queryRaw(query);
  }

  async getAccidentSummaryBySeverity() {
    const query = Prisma.sql`
      SELECT
        severity,
        COUNT(id)::int as "count"
      FROM "public"."accidents"
      GROUP BY severity
      ORDER BY "count" DESC;
    `;
    return this.prisma.$queryRaw(query);
  }
}

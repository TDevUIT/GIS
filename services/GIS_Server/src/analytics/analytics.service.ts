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
      DATE_TRUNC('day', recorded_at)::date as "day",
      ROUND(AVG(pm25)::numeric, 2) as "avgPm25",
      ROUND(AVG(co2)::numeric, 2) as "avgCo2"
    FROM "public"."air_qualities"
    WHERE "districtId" = ${districtId} AND pm25 IS NOT NULL
    GROUP BY "day"
    ORDER BY "day" ASC;
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

  async getWaterQualityHistory(districtId: string) {
    const district = await this.prisma.district.findUnique({
      where: { id: districtId },
    });
    if (!district)
      throw new NotFoundException(`Quận với ID "${districtId}" không tồn tại.`);

    const query = Prisma.sql`
      SELECT 
        DATE_TRUNC('month', recorded_at)::date as "month",
        ROUND(AVG(ph)::numeric, 2) as "avgPh",
        ROUND(AVG(turbidity)::numeric, 2) as "avgTurbidity"
      FROM "public"."water_qualities"
      WHERE "districtId" = ${districtId} AND ph IS NOT NULL
      GROUP BY "month"
      ORDER BY "month" ASC;
    `;
    return this.prisma.$queryRaw(query);
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
    const query = Prisma.sql`
      SELECT 
        CASE 
          WHEN age_max IS NOT NULL THEN age_min || '-' || age_max
          ELSE age_min || '+'
        END as "ageGroup", 
        male,
        female
      FROM "public"."demographics"
      WHERE "populationId" = ${populationId}
      ORDER BY age_min ASC;
    `;
    return this.prisma.$queryRaw(query);
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

    const [byHousingType, byIncomeLevel] = await this.prisma.$transaction([
      this.prisma.$queryRaw(Prisma.sql`
        SELECT 
          CASE
            WHEN housing_type = 'NhaRieng' THEN 'Nhà riêng'
            WHEN housing_type = 'ChungCuCaoCap' THEN 'Chung cư cao cấp'
            WHEN housing_type = 'NhaTrongHem' THEN 'Nhà trong hẻm'
            WHEN housing_type = 'NhaTro' THEN 'Nhà trọ'
            ELSE housing_type::text
          END as "housingType",
          COUNT(id)::int as count
        FROM "public"."households"
        WHERE "populationId" = ${populationId} AND housing_type IS NOT NULL
        GROUP BY housing_type
        ORDER BY count DESC;
      `),
      this.prisma.$queryRaw(Prisma.sql`
        SELECT 
          CASE
            WHEN income_level = 'Thap' THEN 'Thấp'
            WHEN income_level = 'TrungBinh' THEN 'Trung bình'
            WHEN income_level = 'Cao' THEN 'Cao'
            ELSE income_level::text
          END as "incomeLevel",
          COUNT(id)::int as count
        FROM "public"."households"
        WHERE "populationId" = ${populationId} AND income_level IS NOT NULL
        GROUP BY income_level
        ORDER BY count DESC;
      `),
    ]);

    return { byHousingType, byIncomeLevel };
  }
  async getAccidentHotspots(limit = 5) {
    const query = Prisma.sql`
      SELECT
        t.id,
        t.road_name as "roadName",
        d.name as "districtName",
        COUNT(a.id)::int as "accidentCount"
      FROM "public"."traffics" t
      JOIN "public"."accidents" a ON t.id = a."trafficId"
      LEFT JOIN "public"."districts" d ON t."districtId" = d.id
      GROUP BY t.id, d.name
      ORDER BY "accidentCount" DESC
      LIMIT ${limit};
    `;
    return this.prisma.$queryRaw(query);
  }
  async getAccidentsByTimeOfDay() {
    const query = Prisma.sql`
      WITH AccidentsWithTimeSlot AS (
        SELECT
          id,
          CASE
            WHEN EXTRACT(HOUR FROM accident_date) BETWEEN 6 AND 11 THEN 1
            WHEN EXTRACT(HOUR FROM accident_date) BETWEEN 12 AND 16 THEN 2
            WHEN EXTRACT(HOUR FROM accident_date) BETWEEN 17 AND 20 THEN 3
            ELSE 4
          END as "timeSlot"
        FROM "public"."accidents"
      )
      SELECT
        CASE "timeSlot"
          WHEN 1 THEN 'Morning (6-12h)'
          WHEN 2 THEN 'Afternoon (12-17h)'
          WHEN 3 THEN 'Evening (17-21h)'
          ELSE 'Night (21-6h)'
        END as "timeOfDay",
        COUNT(id)::int as "accidentCount"
      FROM AccidentsWithTimeSlot
      GROUP BY "timeSlot"
      ORDER BY "timeSlot";
    `;
    return this.prisma.$queryRaw(query);
  }
  async getAccidentsByDayOfWeek() {
    const query = Prisma.sql`
      SELECT
        TO_CHAR(a.accident_date, 'Day') as "dayOfWeek",
        COUNT(a.id)::int as "accidentCount"
      FROM "public"."accidents" a
      GROUP BY "dayOfWeek", EXTRACT(DOW FROM a.accident_date)
      ORDER BY EXTRACT(DOW FROM a.accident_date);
    `;
    return this.prisma.$queryRaw(query);
  }
  async getTrafficRiskAssessment() {
    const query = Prisma.sql`
      WITH TrafficStats AS (
        SELECT
          t.id,
          t.road_name as "roadName",
          d.name as "districtName",
          COUNT(a.id)::int as "frequency",
          MIN(DATE_PART('day', NOW() - a.accident_date))::int as "recency",
          SUM(
            CASE a.severity
              WHEN 'CRITICAL' THEN 5
              WHEN 'HIGH' THEN 3
              WHEN 'MEDIUM' THEN 2
              WHEN 'LOW' THEN 1
              ELSE 0
            END
          )::int as "magnitude"
        FROM "public"."traffics" t
        LEFT JOIN "public"."accidents" a ON t.id = a."trafficId"
        LEFT JOIN "public"."districts" d ON t."districtId" = d.id
        WHERE a.id IS NOT NULL
        GROUP BY t.id, d.name
      )
      SELECT
        id,
        "roadName",
        "districtName",
        recency,
        frequency,
        magnitude,
        ( (1.0 / (recency + 1)) * 50 + frequency * 30 + magnitude * 20 ) as "riskScore"
      FROM TrafficStats
      ORDER BY "riskScore" DESC;
    `;
    return this.prisma.$queryRaw(query);
  }
}

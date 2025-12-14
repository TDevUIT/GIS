import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BaseRepository } from '../../shared/repository/base.repository';
import { withParsedGeom } from '../../shared/geojson/geojson.util';

@Injectable()
export class AnalyticsRepository extends BaseRepository {
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

  async getLandUseSummary(districtId: string, year: number) {
    const query = Prisma.sql`
      SELECT
        type,
        SUM(area_km2) as "totalAreaKm2"
      FROM "public"."land_uses"
      WHERE "districtId" = ${districtId} AND year = ${year}::integer
      GROUP BY type
      ORDER BY "totalAreaKm2" DESC;
    `;

    return this.prisma.$queryRaw(query);
  }

  async getAirQualityHistory(districtId: string) {
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
    const query = Prisma.sql`
      SELECT
        DATE_TRUNC('day', recorded_at)::date as "day",
        ROUND(AVG(ph)::numeric, 2) as "avgPh",
        ROUND(AVG(turbidity)::numeric, 2) as "avgTurbidity"
      FROM "public"."water_qualities"
      WHERE "districtId" = ${districtId} AND (ph IS NOT NULL OR turbidity IS NOT NULL)
      GROUP BY "day"
      ORDER BY "day" ASC;
    `;

    return this.prisma.$queryRaw(query);
  }

  async getDemographicsSummary(populationId: string) {
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

  async getPublicTransportSummaryByMode() {
    const query = Prisma.sql`
      SELECT
        mode,
        COUNT(id)::int as "routeCount"
      FROM "public"."public_transports"
      GROUP BY mode
      ORDER BY "routeCount" DESC;
    `;

    return this.prisma.$queryRaw(query);
  }

  async getPublicTransportCapacityByMode() {
    const query = Prisma.sql`
      SELECT
        mode,
        SUM(capacity)::int as "totalCapacity"
      FROM "public"."public_transports"
      WHERE capacity IS NOT NULL
      GROUP BY mode
      ORDER BY "totalCapacity" DESC;
    `;

    return this.prisma.$queryRaw(query);
  }

  async getMostFrequentRoutes(limit = 5) {
    const query = Prisma.sql`
      SELECT
        pt.route_name as "routeName",
        pt.mode,
        pt.frequency_min as "frequencyMin",
        d.name as "districtName"
      FROM "public"."public_transports" pt
      LEFT JOIN "public"."districts" d ON pt."districtId" = d.id
      WHERE pt.frequency_min IS NOT NULL
      ORDER BY pt.frequency_min ASC
      LIMIT ${limit};
    `;

    return this.prisma.$queryRaw(query);
  }

  async getAirQualityRankingByDistrict() {
    const query = Prisma.sql`
      SELECT
        d.name as "districtName",
        d.code as "districtCode",
        ROUND(AVG(aq.pm25)::numeric, 2) as "avgPm25"
      FROM "public"."air_qualities" aq
      JOIN "public"."districts" d ON aq."districtId" = d.id
      WHERE aq.recorded_at >= NOW() - INTERVAL '7 days' AND aq.pm25 IS NOT NULL
      GROUP BY d.id
      ORDER BY "avgPm25" DESC;
    `;

    return this.prisma.$queryRaw(query);
  }

  async getWaterQualityRankingByDistrict() {
    const query = Prisma.sql`
      SELECT
        d.name as "districtName",
        d.code as "districtCode",
        ROUND(AVG(wq.contamination_index)::numeric, 2) as "avgContaminationIndex"
      FROM "public"."water_qualities" wq
      JOIN "public"."districts" d ON wq."districtId" = d.id
      WHERE wq.recorded_at >= NOW() - INTERVAL '30 days' AND wq.contamination_index IS NOT NULL
      GROUP BY d.id
      ORDER BY "avgContaminationIndex" DESC;
    `;

    return this.prisma.$queryRaw(query);
  }

  async getTerrainSummaryByDistrict() {
    const query = Prisma.sql`
      SELECT
        d.name as "districtName",
        d.code as "districtCode",
        ROUND(AVG(t.elevation)::numeric, 2) as "avgElevation",
        MAX(t.elevation) as "maxElevation",
        MIN(t.elevation) as "minElevation",
        ROUND(AVG(t.slope)::numeric, 2) as "avgSlope"
      FROM "public"."terrains" t
      JOIN "public"."districts" d ON t."districtId" = d.id
      WHERE t.elevation IS NOT NULL AND t.slope IS NOT NULL
      GROUP BY d.id
      ORDER BY "avgElevation" DESC;
    `;

    return this.prisma.$queryRaw(query);
  }

  async getLandslideRiskAreas(slopeThreshold = 15) {
    const query = Prisma.sql`
      SELECT
        t.id,
        t.slope,
        t.soil_type as "soilType",
        d.name as "districtName",
        ST_AsGeoJSON(t.geom) as geom
      FROM "public"."terrains" t
      JOIN "public"."districts" d ON t."districtId" = d.id
      WHERE t.slope >= ${slopeThreshold};
    `;

    return this.queryMany(query, withParsedGeom);
  }

  async getFloodProneAreas(elevationThreshold = 2) {
    const query = Prisma.sql`
      SELECT
        t.id,
        t.elevation,
        d.name as "districtName",
        ST_AsGeoJSON(t.geom) as geom
      FROM "public"."terrains" t
      JOIN "public"."districts" d ON t."districtId" = d.id
      WHERE t.elevation <= ${elevationThreshold};
    `;

    return this.queryMany(query, withParsedGeom);
  }

  async getSoilTypeDistribution() {
    const query = Prisma.sql`
      SELECT
        t.soil_type as "soilType",
        COUNT(t.id)::int as "count"
      FROM "public"."terrains" t
      WHERE t.soil_type IS NOT NULL
      GROUP BY t.soil_type
      ORDER BY "count" DESC;
    `;

    return this.prisma.$queryRaw(query);
  }
}

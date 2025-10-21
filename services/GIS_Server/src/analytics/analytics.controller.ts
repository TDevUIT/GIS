import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseFloatPipe,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { LandUseSummaryQueryDto } from './dto/analytics-query.dto';

@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @ApiOperation({ summary: 'Get global analytics summary' })
  @ApiResponse({ status: 200, description: 'Global analytics summary data' })
  @Get('summary')
  getGlobalSummary() {
    return this.analyticsService.getGlobalSummary();
  }

  @ApiOperation({ summary: 'Get infrastructure statistics by category' })
  @ApiResponse({
    status: 200,
    description: 'Infrastructure data grouped by category',
  })
  @Get('infrastructure-by-category')
  getInfrastructureByCategory() {
    return this.analyticsService.getInfrastructureByCategory();
  }

  @ApiOperation({ summary: 'Get population history for a district' })
  @ApiParam({ name: 'districtId', description: 'District ID' })
  @ApiResponse({ status: 200, description: 'Population history data' })
  @ApiResponse({ status: 404, description: 'District not found' })
  @Get('population-history/:districtId')
  getPopulationHistory(@Param('districtId') districtId: string) {
    return this.analyticsService.getPopulationHistory(districtId);
  }

  @ApiOperation({ summary: 'Get land use summary' })
  @ApiQuery({ name: 'districtId', description: 'District ID', required: false })
  @ApiQuery({ name: 'year', description: 'Year', required: false })
  @ApiResponse({ status: 200, description: 'Land use summary data' })
  @Get('land-use-summary')
  getLandUseSummary(@Query() query: LandUseSummaryQueryDto) {
    return this.analyticsService.getLandUseSummary(
      query.districtId,
      query.year,
    );
  }

  @ApiOperation({ summary: 'Get air quality history for a district' })
  @ApiParam({ name: 'districtId', description: 'District ID' })
  @ApiResponse({ status: 200, description: 'Air quality history data' })
  @ApiResponse({ status: 404, description: 'District not found' })
  @Get('air-quality-history/:districtId')
  getAirQualityHistory(@Param('districtId') districtId: string) {
    return this.analyticsService.getAirQualityHistory(districtId);
  }

  @ApiOperation({ summary: 'Get accident summary by severity' })
  @ApiResponse({
    status: 200,
    description: 'Accident data grouped by severity',
  })
  @Get('accident-summary-by-severity')
  getAccidentSummaryBySeverity() {
    return this.analyticsService.getAccidentSummaryBySeverity();
  }

  @ApiOperation({ summary: 'Get water quality history for a district' })
  @ApiParam({ name: 'districtId', description: 'District ID' })
  @ApiResponse({ status: 200, description: 'Water quality history data' })
  @ApiResponse({ status: 404, description: 'District not found' })
  @Get('water-quality-history/:districtId')
  getWaterQualityHistory(@Param('districtId') districtId: string) {
    return this.analyticsService.getWaterQualityHistory(districtId);
  }

  @ApiOperation({ summary: 'Get recent system activities' })
  @Get('recent-activities')
  getRecentActivities() {
    return this.analyticsService.getRecentActivities();
  }

  @ApiOperation({ summary: 'Get demographics summary for a population record' })
  @ApiParam({ name: 'populationId', description: 'Population record ID' })
  @Get('demographics-summary/:populationId')
  getDemographicsSummary(@Param('populationId') populationId: string) {
    return this.analyticsService.getDemographicsSummary(populationId);
  }

  @ApiOperation({ summary: 'Get households summary for a population record' })
  @ApiParam({ name: 'populationId', description: 'Population record ID' })
  @Get('households-summary/:populationId')
  getHouseholdsSummary(@Param('populationId') populationId: string) {
    return this.analyticsService.getHouseholdsSummary(populationId);
  }
  @ApiOperation({ summary: 'Get accident hotspots (most dangerous roads)' })
  @ApiResponse({
    status: 200,
    description: 'List of traffic routes with the most accidents',
  })
  @Get('accident-hotspots')
  getAccidentHotspots() {
    return this.analyticsService.getAccidentHotspots();
  }

  @ApiOperation({ summary: 'Get accident statistics by time of day' })
  @ApiResponse({
    status: 200,
    description: 'Accident counts grouped by time of day',
  })
  @Get('accidents-by-time-of-day')
  getAccidentsByTimeOfDay() {
    return this.analyticsService.getAccidentsByTimeOfDay();
  }

  @ApiOperation({ summary: 'Get accident statistics by day of the week' })
  @ApiResponse({
    status: 200,
    description: 'Accident counts grouped by day of the week',
  })
  @Get('accidents-by-day-of-week')
  getAccidentsByDayOfWeek() {
    return this.analyticsService.getAccidentsByDayOfWeek();
  }

  @ApiOperation({ summary: 'Get traffic risk assessment using RFM model' })
  @ApiResponse({
    status: 200,
    description: 'List of traffic routes ranked by risk score',
  })
  @Get('traffic-risk-assessment')
  getTrafficRiskAssessment() {
    return this.analyticsService.getTrafficRiskAssessment();
  }

  @ApiOperation({ summary: 'Get public transport summary by mode' })
  @ApiResponse({
    status: 200,
    description: 'Count of routes for each transport mode',
  })
  @Get('public-transport-summary-by-mode')
  getPublicTransportSummaryByMode() {
    return this.analyticsService.getPublicTransportSummaryByMode();
  }

  @ApiOperation({ summary: 'Get total passenger capacity by transport mode' })
  @ApiResponse({
    status: 200,
    description: 'Total capacity for each transport mode',
  })
  @Get('public-transport-capacity-by-mode')
  getPublicTransportCapacityByMode() {
    return this.analyticsService.getPublicTransportCapacityByMode();
  }

  @ApiOperation({ summary: 'Get the most frequent public transport routes' })
  @ApiResponse({
    status: 200,
    description: 'List of top 5 most frequent routes',
  })
  @Get('most-frequent-routes')
  getMostFrequentRoutes() {
    return this.analyticsService.getMostFrequentRoutes();
  }

  @ApiOperation({ summary: 'Get air quality ranking by district' })
  @ApiResponse({
    status: 200,
    description: 'List of districts ranked by average PM2.5',
  })
  @Get('air-quality-ranking-by-district')
  getAirQualityRankingByDistrict() {
    return this.analyticsService.getAirQualityRankingByDistrict();
  }

  @ApiOperation({ summary: 'Get water quality ranking by district' })
  @ApiResponse({
    status: 200,
    description: 'List of districts ranked by average contamination index',
  })
  @Get('water-quality-ranking-by-district')
  getWaterQualityRankingByDistrict() {
    return this.analyticsService.getWaterQualityRankingByDistrict();
  }

  @ApiOperation({ summary: 'Get terrain summary by district' })
  @ApiResponse({
    status: 200,
    description:
      'Summary of terrain statistics for each district (avg/max/min elevation, avg slope)',
  })
  @Get('terrain-summary-by-district')
  getTerrainSummaryByDistrict() {
    return this.analyticsService.getTerrainSummaryByDistrict();
  }

  @ApiOperation({ summary: 'Get potential landslide risk areas' })
  @ApiQuery({
    name: 'slopeThreshold',
    description: 'Minimum slope to be considered at risk (degrees)',
    required: false,
    example: 15,
  })
  @ApiResponse({
    status: 200,
    description:
      'List of terrain areas with slope greater than the specified threshold',
  })
  @Get('landslide-risk-areas')
  getLandslideRiskAreas(
    @Query('slopeThreshold', new DefaultValuePipe(15), ParseFloatPipe)
    slopeThreshold: number,
  ) {
    return this.analyticsService.getLandslideRiskAreas(slopeThreshold);
  }

  @ApiOperation({ summary: 'Get potential flood-prone areas' })
  @ApiQuery({
    name: 'elevationThreshold',
    description: 'Maximum elevation to be considered at risk (meters)',
    required: false,
    example: 2,
  })
  @ApiResponse({
    status: 200,
    description:
      'List of terrain areas with elevation lower than the specified threshold',
  })
  @Get('flood-prone-areas')
  getFloodProneAreas(
    @Query('elevationThreshold', new DefaultValuePipe(2), ParseFloatPipe)
    elevationThreshold: number,
  ) {
    return this.analyticsService.getFloodProneAreas(elevationThreshold);
  }

  @ApiOperation({ summary: 'Get soil type distribution' })
  @ApiResponse({
    status: 200,
    description: 'Count of terrain records for each soil type',
  })
  @Get('soil-type-distribution')
  getSoilTypeDistribution() {
    return this.analyticsService.getSoilTypeDistribution();
  }
}

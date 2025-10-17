import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';

class LandUseSummaryQuery {
  districtId: string;
  year?: number;
}

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('summary')
  @ApiOperation({
    summary: 'Get global summary',
    description:
      'Retrieve overall statistics and summary data for the entire system',
  })
  @ApiResponse({
    status: 200,
    description: 'Summary data retrieved successfully',
  })
  getGlobalSummary() {
    return this.analyticsService.getGlobalSummary();
  }

  @Get('infrastructure-by-category')
  @ApiOperation({
    summary: 'Get infrastructure by category',
    description: 'Retrieve infrastructure statistics grouped by category',
  })
  @ApiResponse({
    status: 200,
    description: 'Infrastructure data retrieved successfully',
  })
  getInfrastructureByCategory() {
    return this.analyticsService.getInfrastructureByCategory();
  }

  @Get('population-history/:districtId')
  @ApiOperation({
    summary: 'Get population history',
    description: 'Retrieve historical population data for a specific district',
  })
  @ApiParam({ name: 'districtId', description: 'District ID', example: '1' })
  @ApiResponse({
    status: 200,
    description: 'Population history retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'District not found' })
  getPopulationHistory(@Param('districtId') districtId: string) {
    return this.analyticsService.getPopulationHistory(districtId);
  }

  @Get('land-use-summary')
  @ApiOperation({
    summary: 'Get land use summary',
    description: 'Retrieve land use statistics for a district by year',
  })
  @ApiQuery({ name: 'districtId', description: 'District ID', example: '1' })
  @ApiQuery({
    name: 'year',
    required: false,
    description: 'Year',
    example: 2024,
  })
  @ApiResponse({
    status: 200,
    description: 'Land use summary retrieved successfully',
  })
  getLandUseSummary(@Query() query: LandUseSummaryQuery) {
    return this.analyticsService.getLandUseSummary(
      query.districtId,
      query.year,
    );
  }

  @Get('air-quality-history/:districtId')
  @ApiOperation({
    summary: 'Get air quality history',
    description: 'Retrieve historical air quality data for a specific district',
  })
  @ApiParam({ name: 'districtId', description: 'District ID', example: '1' })
  @ApiResponse({
    status: 200,
    description: 'Air quality history retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'District not found' })
  getAirQualityHistory(@Param('districtId') districtId: string) {
    return this.analyticsService.getAirQualityHistory(districtId);
  }

  @Get('accident-summary-by-severity')
  @ApiOperation({
    summary: 'Get accident summary by severity',
    description:
      'Retrieve traffic accident statistics grouped by severity level',
  })
  @ApiResponse({
    status: 200,
    description: 'Accident summary retrieved successfully',
  })
  getAccidentSummaryBySeverity() {
    return this.analyticsService.getAccidentSummaryBySeverity();
  }
  @Get('recent-activities')
  @ApiOperation({
    summary: 'Get recent system activities',
    description:
      'Retrieve a list of the latest activities, such as new infrastructures or accidents',
  })
  @ApiResponse({
    status: 200,
    description: 'Recent activities retrieved successfully',
  })
  getRecentActivities() {
    return this.analyticsService.getRecentActivities();
  }

  @Get('demographics-summary/:populationId')
  @ApiOperation({
    summary: 'Get demographics summary',
    description:
      'Retrieve demographics (age, gender) for a specific population record',
  })
  @ApiParam({ name: 'populationId', description: 'Population record ID' })
  getDemographicsSummary(@Param('populationId') populationId: string) {
    return this.analyticsService.getDemographicsSummary(populationId);
  }

  @Get('households-summary/:populationId')
  @ApiOperation({
    summary: 'Get households summary',
    description:
      'Retrieve households (housing type, income) for a specific population record',
  })
  @ApiParam({ name: 'populationId', description: 'Population record ID' })
  getHouseholdsSummary(@Param('populationId') populationId: string) {
    return this.analyticsService.getHouseholdsSummary(populationId);
  }

  @Get('accident-hotspots')
  @ApiOperation({
    summary: 'Get accident hotspots (most dangerous roads)',
    description: 'Retrieve a list of traffic routes with the most accidents',
  })
  @ApiResponse({
    status: 200,
    description: 'Hotspots data retrieved successfully',
  })
  getAccidentHotspots() {
    return this.analyticsService.getAccidentHotspots();
  }

  @Get('accidents-by-time-of-day')
  @ApiOperation({
    summary: 'Get accident statistics by time of day',
    description:
      'Retrieve accident counts grouped by time of day (Morning, Afternoon, etc.)',
  })
  @ApiResponse({
    status: 200,
    description: 'Time of day stats retrieved successfully',
  })
  getAccidentsByTimeOfDay() {
    return this.analyticsService.getAccidentsByTimeOfDay();
  }

  @Get('accidents-by-day-of-week')
  @ApiOperation({
    summary: 'Get accident statistics by day of the week',
    description: 'Retrieve accident counts for each day of the week',
  })
  @ApiResponse({
    status: 200,
    description: 'Day of week stats retrieved successfully',
  })
  getAccidentsByDayOfWeek() {
    return this.analyticsService.getAccidentsByDayOfWeek();
  }

  @Get('traffic-risk-assessment')
  @ApiOperation({
    summary: 'Get traffic risk assessment (RFM model)',
    description:
      'Retrieve a ranked list of traffic routes by their calculated risk score',
  })
  @ApiResponse({
    status: 200,
    description: 'Risk assessment data retrieved successfully',
  })
  getTrafficRiskAssessment() {
    return this.analyticsService.getTrafficRiskAssessment();
  }

  @Get('public-transport-summary-by-mode')
  @ApiOperation({
    summary: 'Get public transport summary by mode',
    description:
      'Retrieve statistics on the number of routes for each transport mode (BUS, METRO, etc.)',
  })
  @ApiResponse({
    status: 200,
    description: 'Summary retrieved successfully',
  })
  getPublicTransportSummaryByMode() {
    return this.analyticsService.getPublicTransportSummaryByMode();
  }

  @Get('public-transport-capacity-by-mode')
  @ApiOperation({
    summary: 'Get public transport capacity by mode',
    description:
      'Retrieve statistics on the total passenger capacity for each transport mode',
  })
  @ApiResponse({
    status: 200,
    description: 'Capacity data retrieved successfully',
  })
  getPublicTransportCapacityByMode() {
    return this.analyticsService.getPublicTransportCapacityByMode();
  }

  @Get('most-frequent-routes')
  @ApiOperation({
    summary: 'Get most frequent transport routes',
    description:
      'Retrieve a list of the top public transport routes with the highest frequency (lowest minutes per trip)',
  })
  @ApiResponse({
    status: 200,
    description: 'Most frequent routes retrieved successfully',
  })
  getMostFrequentRoutes() {
    return this.analyticsService.getMostFrequentRoutes();
  }
}

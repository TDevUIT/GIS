import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiQuery } from '@nestjs/swagger';
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
  @ApiResponse({ status: 200, description: 'Infrastructure data grouped by category' })
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
  @ApiResponse({ status: 200, description: 'Accident data grouped by severity' })
  @Get('accident-summary-by-severity')
  getAccidentSummaryBySeverity() {
    return this.analyticsService.getAccidentSummaryBySeverity();
  }
}

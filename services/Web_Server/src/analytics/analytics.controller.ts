/* eslint-disable @typescript-eslint/no-unsafe-call */
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
}

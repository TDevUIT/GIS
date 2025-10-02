import { Controller, Get, Param, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

class LandUseSummaryQuery {
  districtId: string;
  year?: number;
}

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('summary')
  getGlobalSummary() {
    return this.analyticsService.getGlobalSummary();
  }

  @Get('infrastructure-by-category')
  getInfrastructureByCategory() {
    return this.analyticsService.getInfrastructureByCategory();
  }

  @Get('population-history/:districtId')
  getPopulationHistory(@Param('districtId') districtId: string) {
    return this.analyticsService.getPopulationHistory(districtId);
  }

  @Get('land-use-summary')
  getLandUseSummary(@Query() query: LandUseSummaryQuery) {
    return this.analyticsService.getLandUseSummary(
      query.districtId,
      query.year,
    );
  }

  @Get('air-quality-history/:districtId')
  getAirQualityHistory(@Param('districtId') districtId: string) {
    return this.analyticsService.getAirQualityHistory(districtId);
  }

  @Get('accident-summary-by-severity')
  getAccidentSummaryBySeverity() {
    return this.analyticsService.getAccidentSummaryBySeverity();
  }
}

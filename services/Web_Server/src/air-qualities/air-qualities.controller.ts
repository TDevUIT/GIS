import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AirQualitiesService } from './air-qualities.service';
import { JwtAuthGuard } from '../auth/auth.gaurd';
import { AdminGuard } from '../auth/admin.gaurd';

class FindAirQualityQuery {
  districtId?: string;
  from?: string;
  to?: string;
}

@Controller('air-qualities')
export class AirQualitiesController {
  constructor(private readonly airQualitiesService: AirQualitiesService) {}

  @Get()
  findAll(@Query() query: FindAirQualityQuery) {
    return this.airQualitiesService.findAll(query);
  }

  @Get('within-radius')
  findWithinRadius(
    @Query('lng') lng: string,
    @Query('lat') lat: string,
    @Query('radiusInMeters') radiusInMeters: string,
  ) {
    return this.airQualitiesService.findWithinRadius(lng, lat, radiusInMeters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.airQualitiesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  create(@Body() createDto: any) {
    return this.airQualitiesService.create(createDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.airQualitiesService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  remove(@Param('id') id: string) {
    return this.airQualitiesService.remove(id);
  }
}

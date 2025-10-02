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
import { WaterQualitiesService } from './water-qualities.service';
import { JwtAuthGuard } from '../auth/auth.gaurd';
import { AdminGuard } from '../auth/admin.gaurd';

class FindWaterQualityQuery {
  districtId?: string;
  from?: string;
  to?: string;
}

@Controller('water-qualities')
export class WaterQualitiesController {
  constructor(private readonly waterQualitiesService: WaterQualitiesService) {}

  @Get()
  findAll(@Query() query: FindWaterQualityQuery) {
    return this.waterQualitiesService.findAll(query);
  }

  @Get('within-radius')
  findWithinRadius(
    @Query('lng') lng: string,
    @Query('lat') lat: string,
    @Query('radiusInMeters') radiusInMeters: string,
  ) {
    return this.waterQualitiesService.findWithinRadius(
      lng,
      lat,
      radiusInMeters,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.waterQualitiesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  create(@Body() createDto: any) {
    return this.waterQualitiesService.create(createDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.waterQualitiesService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  remove(@Param('id') id: string) {
    return this.waterQualitiesService.remove(id);
  }
}

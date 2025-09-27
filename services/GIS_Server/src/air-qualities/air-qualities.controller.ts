import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { AirQualitiesService } from './air-qualities.service';
import { CreateAirQualityDto } from './dto/create-air-quality.dto';
import { UpdateAirQualityDto } from './dto/update-air-quality.dto';
import { FindAirQualityQueryDto, FindWithinRadiusDto } from './dto/query.dto';

@Controller('air-qualities')
export class AirQualitiesController {
  constructor(private readonly airQualitiesService: AirQualitiesService) {}

  @Post()
  create(@Body() createAirQualityDto: CreateAirQualityDto) {
    return this.airQualitiesService.create(createAirQualityDto);
  }

  @Get()
  findAll(@Query() query: FindAirQualityQueryDto) {
    return this.airQualitiesService.findAll(query);
  }

  @Get('within-radius')
  findWithinRadius(@Query() query: FindWithinRadiusDto) {
    return this.airQualitiesService.findWithinRadius(
      query.lng,
      query.lat,
      query.radiusInMeters,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.airQualitiesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAirQualityDto: UpdateAirQualityDto,
  ) {
    return this.airQualitiesService.update(id, updateAirQualityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.airQualitiesService.remove(id);
  }
}

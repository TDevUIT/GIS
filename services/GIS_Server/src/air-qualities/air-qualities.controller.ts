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
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AirQualitiesService } from './air-qualities.service';
import { CreateAirQualityDto } from './dto/create-air-quality.dto';
import { UpdateAirQualityDto } from './dto/update-air-quality.dto';
import { FindAirQualityQueryDto, FindWithinRadiusDto } from './dto/query.dto';

@ApiTags('air-qualities')
@Controller('air-qualities')
export class AirQualitiesController {
  constructor(private readonly airQualitiesService: AirQualitiesService) {}

  @ApiOperation({ summary: 'Create a new air quality record' })
  @ApiResponse({ status: 201, description: 'Air quality record created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post()
  create(@Body() createAirQualityDto: CreateAirQualityDto) {
    return this.airQualitiesService.create(createAirQualityDto);
  }

  @ApiOperation({ summary: 'Get all air quality records' })
  @ApiResponse({ status: 200, description: 'List of air quality records' })
  @Get()
  findAll(@Query() query: FindAirQualityQueryDto) {
    return this.airQualitiesService.findAll(query);
  }

  @ApiOperation({ summary: 'Find air quality records within radius' })
  @ApiQuery({ name: 'lng', description: 'Longitude' })
  @ApiQuery({ name: 'lat', description: 'Latitude' })
  @ApiQuery({ name: 'radiusInMeters', description: 'Radius in meters' })
  @ApiResponse({ status: 200, description: 'Air quality records within radius' })
  @Get('within-radius')
  findWithinRadius(@Query() query: FindWithinRadiusDto) {
    return this.airQualitiesService.findWithinRadius(
      query.lng,
      query.lat,
      query.radiusInMeters,
    );
  }

  @ApiOperation({ summary: 'Get an air quality record by ID' })
  @ApiParam({ name: 'id', description: 'Air quality record ID' })
  @ApiResponse({ status: 200, description: 'Air quality record found' })
  @ApiResponse({ status: 404, description: 'Air quality record not found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.airQualitiesService.findOne(id);
  }

  @ApiOperation({ summary: 'Update an air quality record' })
  @ApiParam({ name: 'id', description: 'Air quality record ID' })
  @ApiResponse({ status: 200, description: 'Air quality record updated successfully' })
  @ApiResponse({ status: 404, description: 'Air quality record not found' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAirQualityDto: UpdateAirQualityDto,
  ) {
    return this.airQualitiesService.update(id, updateAirQualityDto);
  }

  @ApiOperation({ summary: 'Delete an air quality record' })
  @ApiParam({ name: 'id', description: 'Air quality record ID' })
  @ApiResponse({ status: 200, description: 'Air quality record deleted successfully' })
  @ApiResponse({ status: 404, description: 'Air quality record not found' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.airQualitiesService.remove(id);
  }
}

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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { AirQualitiesService } from './air-qualities.service';
import { JwtAuthGuard } from '../auth/auth.gaurd';
import { AdminGuard } from '../auth/admin.gaurd';

class FindAirQualityQuery {
  districtId?: string;
  from?: string;
  to?: string;
}

@ApiTags('Air Quality')
@Controller('air-qualities')
export class AirQualitiesController {
  constructor(private readonly airQualitiesService: AirQualitiesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all air quality records', description: 'Retrieve air quality monitoring data with optional filters' })
  @ApiQuery({ name: 'districtId', required: false, description: 'Filter by district ID', example: '1' })
  @ApiQuery({ name: 'from', required: false, description: 'Start date (YYYY-MM-DD)', example: '2024-01-01' })
  @ApiQuery({ name: 'to', required: false, description: 'End date (YYYY-MM-DD)', example: '2024-12-31' })
  @ApiResponse({ status: 200, description: 'Air quality records retrieved successfully' })
  findAll(@Query() query: FindAirQualityQuery) {
    return this.airQualitiesService.findAll(query);
  }

  @Get('within-radius')
  @ApiOperation({ summary: 'Find air quality within radius', description: 'Find air quality monitoring stations within a specified radius' })
  @ApiQuery({ name: 'lng', description: 'Longitude', example: '106.6297' })
  @ApiQuery({ name: 'lat', description: 'Latitude', example: '10.8231' })
  @ApiQuery({ name: 'radiusInMeters', description: 'Radius in meters', example: '1000' })
  @ApiResponse({ status: 200, description: 'Air quality stations found' })
  findWithinRadius(
    @Query('lng') lng: string,
    @Query('lat') lat: string,
    @Query('radiusInMeters') radiusInMeters: string,
  ) {
    return this.airQualitiesService.findWithinRadius(lng, lat, radiusInMeters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get air quality by ID', description: 'Retrieve a specific air quality record by ID' })
  @ApiParam({ name: 'id', description: 'Air quality record ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Air quality record found' })
  @ApiResponse({ status: 404, description: 'Air quality record not found' })
  findOne(@Param('id') id: string) {
    return this.airQualitiesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create air quality record', description: 'Create a new air quality record (Admin only)' })
  @ApiResponse({ status: 201, description: 'Air quality record created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(@Body() createDto: any) {
    return this.airQualitiesService.create(createDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update air quality record', description: 'Update an existing air quality record (Admin only)' })
  @ApiParam({ name: 'id', description: 'Air quality record ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Air quality record updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Air quality record not found' })
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.airQualitiesService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete air quality record', description: 'Delete an air quality record (Admin only)' })
  @ApiParam({ name: 'id', description: 'Air quality record ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Air quality record deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Air quality record not found' })
  remove(@Param('id') id: string) {
    return this.airQualitiesService.remove(id);
  }
}

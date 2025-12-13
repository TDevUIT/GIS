/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
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
import { WaterQualitiesService } from './water-qualities.service';
import { JwtAuthGuard } from '../auth/auth.gaurd';
import { AdminGuard } from '../auth/admin.gaurd';
import { CreateWaterQualityDto } from './dto/create-water-quality.dto';
import { UpdateWaterQualityDto } from './dto/update-water-quality.dto';

class FindWaterQualityQuery {
  districtId?: string;
  from?: string;
  to?: string;
}

@ApiTags('Water Quality')
@Controller('water-qualities')
export class WaterQualitiesController {
  constructor(private readonly waterQualitiesService: WaterQualitiesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all water quality records', description: 'Retrieve water quality monitoring data with optional filters' })
  @ApiQuery({ name: 'districtId', required: false, description: 'Filter by district ID', example: '1' })
  @ApiQuery({ name: 'from', required: false, description: 'Start date (YYYY-MM-DD)', example: '2024-01-01' })
  @ApiQuery({ name: 'to', required: false, description: 'End date (YYYY-MM-DD)', example: '2024-12-31' })
  @ApiResponse({ status: 200, description: 'Water quality records retrieved successfully' })
  findAll(@Query() query: FindWaterQualityQuery) {
    return this.waterQualitiesService.findAll(query);
  }

  @Get('within-radius')
  @ApiOperation({ summary: 'Find water quality within radius', description: 'Find water quality monitoring stations within a specified radius' })
  @ApiQuery({ name: 'lng', description: 'Longitude', example: '106.6297' })
  @ApiQuery({ name: 'lat', description: 'Latitude', example: '10.8231' })
  @ApiQuery({ name: 'radiusInMeters', description: 'Radius in meters', example: '1000' })
  @ApiResponse({ status: 200, description: 'Water quality stations found' })
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
  @ApiOperation({ summary: 'Get water quality by ID', description: 'Retrieve a specific water quality record by ID' })
  @ApiParam({ name: 'id', description: 'Water quality record ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Water quality record found' })
  @ApiResponse({ status: 404, description: 'Water quality record not found' })
  findOne(@Param('id') id: string) {
    return this.waterQualitiesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create water quality record', description: 'Create a new water quality record (Admin only)' })
  @ApiResponse({ status: 201, description: 'Water quality record created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(@Body() createDto: CreateWaterQualityDto) {
    return this.waterQualitiesService.create(createDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update water quality record', description: 'Update an existing water quality record (Admin only)' })
  @ApiParam({ name: 'id', description: 'Water quality record ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Water quality record updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Water quality record not found' })
  update(@Param('id') id: string, @Body() updateDto: UpdateWaterQualityDto) {
    return this.waterQualitiesService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete water quality record', description: 'Delete a water quality record (Admin only)' })
  @ApiParam({ name: 'id', description: 'Water quality record ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Water quality record deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Water quality record not found' })
  remove(@Param('id') id: string) {
    return this.waterQualitiesService.remove(id);
  }
}

/* eslint-disable @typescript-eslint/no-unsafe-call */
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
import { DistrictsService } from './districts.service';
import { JwtAuthGuard } from '../auth/auth.gaurd';
import { AdminGuard } from '../auth/admin.gaurd';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';
import { IntersectsWktDto } from './dto/intersects-wkt.dto';

@ApiTags('Districts')
@Controller('districts')
export class DistrictsController {
  constructor(private readonly districtsService: DistrictsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all districts',
    description: 'Retrieve all district records with geometry data',
  })
  @ApiResponse({ status: 200, description: 'Districts retrieved successfully' })
  findAll() {
    return this.districtsService.findAll();
  }

  @Get('contains-point')
  @ApiOperation({
    summary: 'Find district containing point',
    description:
      'Find which district contains a specific point (longitude, latitude)',
  })
  @ApiQuery({ name: 'lng', description: 'Longitude', example: '106.6297' })
  @ApiQuery({ name: 'lat', description: 'Latitude', example: '10.8231' })
  @ApiResponse({ status: 200, description: 'District found' })
  @ApiResponse({ status: 404, description: 'No district contains this point' })
  findContainingPoint(@Query('lng') lng: string, @Query('lat') lat: string) {
    return this.districtsService.findContainingPoint(lng, lat);
  }

  @Post('intersects-with')
  @ApiOperation({
    summary: 'Find intersecting districts',
    description: 'Find districts that intersect with a given WKT geometry',
  })
  @ApiResponse({ status: 200, description: 'Intersecting districts found' })
  findIntersecting(@Body() body: IntersectsWktDto) {
    return this.districtsService.findIntersecting(body);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get district by ID',
    description: 'Retrieve a specific district by ID',
  })
  @ApiParam({ name: 'id', description: 'District ID', example: '1' })
  @ApiResponse({ status: 200, description: 'District found' })
  @ApiResponse({ status: 404, description: 'District not found' })
  findOne(@Param('id') id: string) {
    return this.districtsService.findOne(id);
  }

  @Get(':districtId/wards')
  @ApiOperation({
    summary: 'Get wards of district',
    description: 'Retrieve all wards belonging to a specific district',
  })
  @ApiParam({ name: 'districtId', description: 'District ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Wards retrieved successfully' })
  findWardsOfDistrict(@Param('districtId') districtId: string) {
    return this.districtsService.findWardsOfDistrict(districtId);
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Create district',
    description: 'Create a new district (Admin only)',
  })
  @ApiResponse({ status: 201, description: 'District created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  create(@Body() createDto: CreateDistrictDto) {
    return this.districtsService.create(createDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Update district',
    description: 'Update an existing district (Admin only)',
  })
  @ApiParam({ name: 'id', description: 'District ID', example: '1' })
  @ApiResponse({ status: 200, description: 'District updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  @ApiResponse({ status: 404, description: 'District not found' })
  update(@Param('id') id: string, @Body() updateDto: UpdateDistrictDto) {
    return this.districtsService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Delete district',
    description: 'Delete a district (Admin only)',
  })
  @ApiParam({ name: 'id', description: 'District ID', example: '1' })
  @ApiResponse({ status: 200, description: 'District deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  @ApiResponse({ status: 404, description: 'District not found' })
  remove(@Param('id') id: string) {
    return this.districtsService.remove(id);
  }
}

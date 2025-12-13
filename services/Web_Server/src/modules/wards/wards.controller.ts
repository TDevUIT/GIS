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
import { WardsService } from './wards.service';
import { JwtAuthGuard } from '../auth/auth.gaurd';
import { AdminGuard } from '../auth/admin.gaurd';
import { CreateWardDto } from './dto/create-ward.dto';
import { UpdateWardDto } from './dto/update-ward.dto';
import { IntersectsWktDto } from './dto/intersects-wkt.dto';

@ApiTags('Wards')
@Controller('wards')
export class WardsController {
  constructor(private readonly wardsService: WardsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all wards',
    description: 'Retrieve all wards, optionally filtered by district',
  })
  @ApiQuery({
    name: 'districtId',
    required: false,
    description: 'Filter by district ID',
    example: '1',
  })
  @ApiResponse({ status: 200, description: 'Wards retrieved successfully' })
  findAll(@Query('districtId') districtId?: string) {
    return this.wardsService.findAll(districtId);
  }

  @Get('contains-point')
  @ApiOperation({
    summary: 'Find ward containing point',
    description: 'Find which ward contains a specific point',
  })
  @ApiQuery({ name: 'lng', description: 'Longitude', example: '106.6297' })
  @ApiQuery({ name: 'lat', description: 'Latitude', example: '10.8231' })
  @ApiResponse({ status: 200, description: 'Ward found' })
  @ApiResponse({ status: 404, description: 'No ward contains this point' })
  findContainingPoint(@Query('lng') lng: string, @Query('lat') lat: string) {
    return this.wardsService.findContainingPoint(lng, lat);
  }

  @Post('intersects-with')
  @ApiOperation({
    summary: 'Find intersecting wards',
    description: 'Find wards that intersect with a given WKT geometry',
  })
  @ApiResponse({ status: 200, description: 'Intersecting wards found' })
  findIntersecting(@Body() body: IntersectsWktDto) {
    return this.wardsService.findIntersecting(body);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get ward by ID',
    description: 'Retrieve a specific ward by ID',
  })
  @ApiParam({ name: 'id', description: 'Ward ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Ward found' })
  @ApiResponse({ status: 404, description: 'Ward not found' })
  findOne(@Param('id') id: string) {
    return this.wardsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Create ward',
    description: 'Create a new ward (Admin only)',
  })
  @ApiResponse({ status: 201, description: 'Ward created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(@Body() createDto: CreateWardDto) {
    return this.wardsService.create(createDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Update ward',
    description: 'Update an existing ward (Admin only)',
  })
  @ApiParam({ name: 'id', description: 'Ward ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Ward updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Ward not found' })
  update(@Param('id') id: string, @Body() updateDto: UpdateWardDto) {
    return this.wardsService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Delete ward',
    description: 'Delete a ward (Admin only)',
  })
  @ApiParam({ name: 'id', description: 'Ward ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Ward deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Ward not found' })
  remove(@Param('id') id: string) {
    return this.wardsService.remove(id);
  }
}

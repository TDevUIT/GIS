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
import { LandUsesService } from './land-uses.service';
import { JwtAuthGuard } from '../auth/auth.gaurd';
import { AdminGuard } from '../auth/admin.gaurd';
import { CreateLandUseDto } from './dto/create-land-use.dto';
import { UpdateLandUseDto } from './dto/update-land-use.dto';
import { IntersectsWktDto } from './dto/intersects-wkt.dto';
import { FindLandUsesQueryDto } from './dto/find-land-uses.query.dto';

@ApiTags('Land Use')
@Controller('land-uses')
export class LandUsesController {
  constructor(private readonly landUsesService: LandUsesService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all land use records',
    description: 'Retrieve land use planning data with optional filters',
  })
  @ApiQuery({
    name: 'districtId',
    required: false,
    description: 'Filter by district ID',
    example: '1',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    description: 'Filter by land use type',
    example: 'residential',
  })
  @ApiResponse({
    status: 200,
    description: 'Land use records retrieved successfully',
  })
  findAll(@Query() query: FindLandUsesQueryDto) {
    return this.landUsesService.findAll(query);
  }

  @Get('at-point')
  @ApiOperation({
    summary: 'Find land use at point',
    description: 'Find land use classification at a specific point',
  })
  @ApiQuery({ name: 'lng', description: 'Longitude', example: '106.6297' })
  @ApiQuery({ name: 'lat', description: 'Latitude', example: '10.8231' })
  @ApiResponse({ status: 200, description: 'Land use found' })
  @ApiResponse({ status: 404, description: 'No land use found at this point' })
  findAtPoint(@Query('lng') lng: string, @Query('lat') lat: string) {
    return this.landUsesService.findAtPoint(lng, lat);
  }

  @Post('intersects-with')
  @ApiOperation({
    summary: 'Find intersecting land uses',
    description: 'Find land uses that intersect with a given WKT geometry',
  })
  @ApiResponse({ status: 200, description: 'Intersecting land uses found' })
  findIntersecting(@Body() body: IntersectsWktDto) {
    return this.landUsesService.findIntersecting(body);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get land use by ID',
    description: 'Retrieve a specific land use record by ID',
  })
  @ApiParam({ name: 'id', description: 'Land use record ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Land use record found' })
  @ApiResponse({ status: 404, description: 'Land use record not found' })
  findOne(@Param('id') id: string) {
    return this.landUsesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Create land use record',
    description: 'Create a new land use record (Admin only)',
  })
  @ApiResponse({
    status: 201,
    description: 'Land use record created successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(@Body() createDto: CreateLandUseDto) {
    return this.landUsesService.create(createDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Update land use record',
    description: 'Update an existing land use record (Admin only)',
  })
  @ApiParam({ name: 'id', description: 'Land use record ID', example: '1' })
  @ApiResponse({
    status: 200,
    description: 'Land use record updated successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Land use record not found' })
  update(@Param('id') id: string, @Body() updateDto: UpdateLandUseDto) {
    return this.landUsesService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Delete land use record',
    description: 'Delete a land use record (Admin only)',
  })
  @ApiParam({ name: 'id', description: 'Land use record ID', example: '1' })
  @ApiResponse({
    status: 200,
    description: 'Land use record deleted successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Land use record not found' })
  remove(@Param('id') id: string) {
    return this.landUsesService.remove(id);
  }
}

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
import { TrafficsService } from './traffics.service';
import { JwtAuthGuard } from '../auth/auth.gaurd';
import { AdminGuard } from '../auth/admin.gaurd';

class FindTrafficsQuery {
  districtId?: string;
  roadName?: string;
}

@ApiTags('Traffic')
@Controller('traffics')
export class TrafficsController {
  constructor(private readonly trafficsService: TrafficsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all traffic data',
    description: 'Retrieve traffic flow data with optional filters',
  })
  @ApiQuery({
    name: 'districtId',
    required: false,
    description: 'Filter by district ID',
    example: '1',
  })
  @ApiQuery({
    name: 'roadName',
    required: false,
    description: 'Filter by road name',
    example: 'Nguyen Hue Street',
  })
  @ApiResponse({
    status: 200,
    description: 'Traffic data retrieved successfully',
  })
  findAll(@Query() query: FindTrafficsQuery) {
    return this.trafficsService.findAll(query);
  }

  @Post('intersects-with')
  @ApiOperation({
    summary: 'Find intersecting traffic data',
    description: 'Find traffic data that intersects with a given WKT geometry',
  })
  @ApiResponse({ status: 200, description: 'Intersecting traffic data found' })
  findIntersecting(@Body() wktBody: any) {
    return this.trafficsService.findIntersecting(wktBody);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get traffic data by ID',
    description: 'Retrieve a specific traffic record by ID',
  })
  @ApiParam({ name: 'id', description: 'Traffic record ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Traffic record found' })
  @ApiResponse({ status: 404, description: 'Traffic record not found' })
  findOne(@Param('id') id: string) {
    return this.trafficsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Create traffic record',
    description: 'Create a new traffic record (Admin only)',
  })
  @ApiResponse({
    status: 201,
    description: 'Traffic record created successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(@Body() createDto: any) {
    return this.trafficsService.create(createDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Update traffic record',
    description: 'Update an existing traffic record (Admin only)',
  })
  @ApiParam({ name: 'id', description: 'Traffic record ID', example: '1' })
  @ApiResponse({
    status: 200,
    description: 'Traffic record updated successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Traffic record not found' })
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.trafficsService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Delete traffic record',
    description: 'Delete a traffic record (Admin only)',
  })
  @ApiParam({ name: 'id', description: 'Traffic record ID', example: '1' })
  @ApiResponse({
    status: 200,
    description: 'Traffic record deleted successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Traffic record not found' })
  remove(@Param('id') id: string) {
    return this.trafficsService.remove(id);
  }
}

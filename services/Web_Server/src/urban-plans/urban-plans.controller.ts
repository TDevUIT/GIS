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
import { UrbanPlansService } from './urban-plans.service';
import { JwtAuthGuard } from '../auth/auth.gaurd';
import { AdminGuard } from '../auth/admin.gaurd';

class FindUrbanPlansQuery {
  districtId?: string;
  zoningType?: string;
}

@ApiTags('Urban Plans')
@Controller('urban-plans')
export class UrbanPlansController {
  constructor(private readonly urbanPlansService: UrbanPlansService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all urban plans',
    description: 'Retrieve urban development plans with optional filters',
  })
  @ApiQuery({
    name: 'districtId',
    required: false,
    description: 'Filter by district ID',
    example: '1',
  })
  @ApiQuery({
    name: 'zoningType',
    required: false,
    description: 'Filter by zoning type',
    example: 'commercial',
  })
  @ApiResponse({
    status: 200,
    description: 'Urban plans retrieved successfully',
  })
  findAll(@Query() query: FindUrbanPlansQuery) {
    return this.urbanPlansService.findAll(query);
  }

  @Get('at-point')
  @ApiOperation({
    summary: 'Find urban plan at point',
    description: 'Find urban planning zone at a specific point',
  })
  @ApiQuery({ name: 'lng', description: 'Longitude', example: '106.6297' })
  @ApiQuery({ name: 'lat', description: 'Latitude', example: '10.8231' })
  @ApiResponse({ status: 200, description: 'Urban plan found' })
  @ApiResponse({
    status: 404,
    description: 'No urban plan found at this point',
  })
  findAtPoint(@Query('lng') lng: string, @Query('lat') lat: string) {
    return this.urbanPlansService.findAtPoint(lng, lat);
  }

  @Post('intersects-with')
  @ApiOperation({
    summary: 'Find intersecting urban plans',
    description: 'Find urban plans that intersect with a given WKT geometry',
  })
  @ApiResponse({ status: 200, description: 'Intersecting urban plans found' })
  findIntersecting(@Body() wktBody: any) {
    return this.urbanPlansService.findIntersecting(wktBody);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get urban plan by ID',
    description: 'Retrieve a specific urban plan by ID',
  })
  @ApiParam({ name: 'id', description: 'Urban plan ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Urban plan found' })
  @ApiResponse({ status: 404, description: 'Urban plan not found' })
  findOne(@Param('id') id: string) {
    return this.urbanPlansService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Create urban plan',
    description: 'Create a new urban plan (Admin only)',
  })
  @ApiResponse({ status: 201, description: 'Urban plan created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(@Body() createDto: any) {
    return this.urbanPlansService.create(createDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Update urban plan',
    description: 'Update an existing urban plan (Admin only)',
  })
  @ApiParam({ name: 'id', description: 'Urban plan ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Urban plan updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Urban plan not found' })
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.urbanPlansService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Delete urban plan',
    description: 'Delete an urban plan (Admin only)',
  })
  @ApiParam({ name: 'id', description: 'Urban plan ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Urban plan deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Urban plan not found' })
  remove(@Param('id') id: string) {
    return this.urbanPlansService.remove(id);
  }
}

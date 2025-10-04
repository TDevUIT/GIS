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
import { TerrainsService } from './terrains.service';
import { JwtAuthGuard } from '../auth/auth.gaurd';
import { AdminGuard } from '../auth/admin.gaurd';

@ApiTags('Terrains')
@Controller('terrains')
export class TerrainsController {
  constructor(private readonly terrainsService: TerrainsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all terrains', description: 'Retrieve all terrain records with optional district filter' })
  @ApiQuery({ name: 'districtId', required: false, description: 'Filter by district ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Terrains retrieved successfully' })
  findAll(@Query('districtId') districtId?: string) {
    return this.terrainsService.findAll(districtId);
  }

  @Get('at-point')
  @ApiOperation({ summary: 'Find terrain at point', description: 'Find terrain information at a specific point' })
  @ApiQuery({ name: 'lng', description: 'Longitude', example: '106.6297' })
  @ApiQuery({ name: 'lat', description: 'Latitude', example: '10.8231' })
  @ApiResponse({ status: 200, description: 'Terrain found' })
  @ApiResponse({ status: 404, description: 'No terrain found at this point' })
  findAtPoint(@Query('lng') lng: string, @Query('lat') lat: string) {
    return this.terrainsService.findAtPoint(lng, lat);
  }

  @Post('intersects-with')
  @ApiOperation({ summary: 'Find intersecting terrains', description: 'Find terrains that intersect with a given WKT geometry' })
  @ApiResponse({ status: 200, description: 'Intersecting terrains found' })
  findIntersecting(@Body() wktBody: any) {
    return this.terrainsService.findIntersecting(wktBody);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get terrain by ID', description: 'Retrieve a specific terrain by ID' })
  @ApiParam({ name: 'id', description: 'Terrain ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Terrain found' })
  @ApiResponse({ status: 404, description: 'Terrain not found' })
  findOne(@Param('id') id: string) {
    return this.terrainsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create terrain', description: 'Create a new terrain (Admin only)' })
  @ApiResponse({ status: 201, description: 'Terrain created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(@Body() createDto: any) {
    return this.terrainsService.create(createDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update terrain', description: 'Update an existing terrain (Admin only)' })
  @ApiParam({ name: 'id', description: 'Terrain ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Terrain updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Terrain not found' })
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.terrainsService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete terrain', description: 'Delete a terrain (Admin only)' })
  @ApiParam({ name: 'id', description: 'Terrain ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Terrain deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Terrain not found' })
  remove(@Param('id') id: string) {
    return this.terrainsService.remove(id);
  }
}

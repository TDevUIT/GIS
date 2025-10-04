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
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiQuery, ApiBody } from '@nestjs/swagger';
import { LandUsesService } from './land-uses.service';
import { CreateLandUseDto } from './dto/create-land-use.dto';
import { UpdateLandUseDto } from './dto/update-land-use.dto';
import { FindLandUsesQueryDto } from './dto/query.dto';
import { GisPointQueryDto, GisWktBodyDto } from '../common/dto/gis-query.dto';

@ApiTags('land-uses')
@Controller('land-uses')
export class LandUsesController {
  constructor(private readonly landUsesService: LandUsesService) {}

  @ApiOperation({ summary: 'Find land use at a specific point' })
  @ApiQuery({ name: 'lng', description: 'Longitude' })
  @ApiQuery({ name: 'lat', description: 'Latitude' })
  @ApiResponse({ status: 200, description: 'Land use at the specified point' })
  @ApiResponse({ status: 404, description: 'No land use found at the point' })
  @Get('at-point')
  findAtPoint(@Query() query: GisPointQueryDto) {
    return this.landUsesService.findLandUseAtPoint(query.lng, query.lat);
  }

  @ApiOperation({ summary: 'Find land uses intersecting with WKT geometry' })
  @ApiBody({ type: GisWktBodyDto, description: 'WKT geometry string' })
  @ApiResponse({ status: 200, description: 'Land uses intersecting with the geometry' })
  @Post('intersects-with')
  findIntersecting(@Body() body: GisWktBodyDto) {
    return this.landUsesService.findIntersecting(body.wkt);
  }

  @ApiOperation({ summary: 'Create a new land use record' })
  @ApiResponse({ status: 201, description: 'Land use record created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post()
  create(@Body() createLandUseDto: CreateLandUseDto) {
    return this.landUsesService.create(createLandUseDto);
  }

  @ApiOperation({ summary: 'Get all land use records' })
  @ApiResponse({ status: 200, description: 'List of land use records' })
  @Get()
  findAll(@Query() query: FindLandUsesQueryDto) {
    return this.landUsesService.findAll(query);
  }

  @ApiOperation({ summary: 'Get a land use record by ID' })
  @ApiParam({ name: 'id', description: 'Land use record ID' })
  @ApiResponse({ status: 200, description: 'Land use record found' })
  @ApiResponse({ status: 404, description: 'Land use record not found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.landUsesService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a land use record' })
  @ApiParam({ name: 'id', description: 'Land use record ID' })
  @ApiResponse({ status: 200, description: 'Land use record updated successfully' })
  @ApiResponse({ status: 404, description: 'Land use record not found' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLandUseDto: UpdateLandUseDto) {
    return this.landUsesService.update(id, updateLandUseDto);
  }

  @ApiOperation({ summary: 'Delete a land use record' })
  @ApiParam({ name: 'id', description: 'Land use record ID' })
  @ApiResponse({ status: 200, description: 'Land use record deleted successfully' })
  @ApiResponse({ status: 404, description: 'Land use record not found' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.landUsesService.remove(id);
  }
}

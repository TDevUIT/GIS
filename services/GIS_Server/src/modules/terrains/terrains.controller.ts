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
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { TerrainsService } from './terrains.service';
import { CreateTerrainDto } from './dto/create-terrain.dto';
import { UpdateTerrainDto } from './dto/update-terrain.dto';
import { QueryPointDto, IntersectsWktDto } from './dto/query-gis.dto';
import { AdminGuard } from '../../auth/admin.guard';

@ApiTags('terrains')
@Controller('terrains')
export class TerrainsController {
  constructor(private readonly terrainsService: TerrainsService) {}

  @ApiOperation({ summary: 'Find terrain at a specific point' })
  @ApiQuery({ name: 'lng', description: 'Longitude' })
  @ApiQuery({ name: 'lat', description: 'Latitude' })
  @ApiResponse({ status: 200, description: 'Terrain at the specified point' })
  @ApiResponse({ status: 404, description: 'No terrain found at the point' })
  @Get('at-point')
  findAtPoint(@Query() query: QueryPointDto) {
    return this.terrainsService.findTerrainAtPoint(query.lng, query.lat);
  }

  @ApiOperation({ summary: 'Find terrains intersecting with WKT geometry' })
  @ApiBody({ type: IntersectsWktDto, description: 'WKT geometry string' })
  @ApiResponse({
    status: 200,
    description: 'Terrains intersecting with the geometry',
  })
  @Post('intersects-with')
  findIntersecting(@Body() body: IntersectsWktDto) {
    return this.terrainsService.findTerrainsIntersecting(body.wkt);
  }

  @ApiOperation({ summary: 'Create a new terrain record' })
  @ApiResponse({
    status: 201,
    description: 'Terrain record created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post()
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  create(@Body() createTerrainDto: CreateTerrainDto) {
    return this.terrainsService.create(createTerrainDto);
  }

  @ApiOperation({ summary: 'Get all terrain records' })
  @ApiQuery({ name: 'districtId', description: 'District ID', required: false })
  @ApiResponse({ status: 200, description: 'List of terrain records' })
  @Get()
  findAll(@Query('districtId') districtId?: string) {
    return this.terrainsService.findAll(districtId);
  }

  @ApiOperation({ summary: 'Get a terrain record by ID' })
  @ApiParam({ name: 'id', description: 'Terrain record ID' })
  @ApiResponse({ status: 200, description: 'Terrain record found' })
  @ApiResponse({ status: 404, description: 'Terrain record not found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.terrainsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a terrain record' })
  @ApiParam({ name: 'id', description: 'Terrain record ID' })
  @ApiResponse({
    status: 200,
    description: 'Terrain record updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Terrain record not found' })
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  update(@Param('id') id: string, @Body() updateTerrainDto: UpdateTerrainDto) {
    return this.terrainsService.update(id, updateTerrainDto);
  }

  @ApiOperation({ summary: 'Delete a terrain record' })
  @ApiParam({ name: 'id', description: 'Terrain record ID' })
  @ApiResponse({
    status: 200,
    description: 'Terrain record deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Terrain record not found' })
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  remove(@Param('id') id: string) {
    return this.terrainsService.remove(id);
  }
}

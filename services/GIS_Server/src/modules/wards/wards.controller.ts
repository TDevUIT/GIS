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
import { WardsService } from './wards.service';
import { CreateWardDto } from './dto/create-ward.dto';
import { UpdateWardDto } from './dto/update-ward.dto';
import { ContainsPointDto, IntersectsWktDto } from './dto/query-gis.dto';
import { AdminGuard } from '../../auth/admin.guard';

@ApiTags('wards')
@Controller('wards')
export class WardsController {
  constructor(private readonly wardsService: WardsService) {}

  @ApiOperation({ summary: 'Find ward containing a point' })
  @ApiQuery({ name: 'lng', description: 'Longitude' })
  @ApiQuery({ name: 'lat', description: 'Latitude' })
  @ApiResponse({ status: 200, description: 'Ward containing the point' })
  @ApiResponse({
    status: 404,
    description: 'No ward found containing the point',
  })
  @Get('contains-point')
  findContainingPoint(@Query() query: ContainsPointDto) {
    return this.wardsService.findWardContainingPoint(query.lng, query.lat);
  }

  @ApiOperation({ summary: 'Find wards intersecting with WKT geometry' })
  @ApiBody({ type: IntersectsWktDto, description: 'WKT geometry string' })
  @ApiResponse({
    status: 200,
    description: 'Wards intersecting with the geometry',
  })
  @Post('intersects-with')
  findIntersecting(@Body() body: IntersectsWktDto) {
    return this.wardsService.findWardsIntersecting(body.wkt);
  }

  @ApiOperation({ summary: 'Create a new ward' })
  @ApiResponse({ status: 201, description: 'Ward created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post()
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  create(@Body() createWardDto: CreateWardDto) {
    return this.wardsService.create(createWardDto);
  }

  @ApiOperation({ summary: 'Get all wards' })
  @ApiQuery({ name: 'districtId', description: 'District ID', required: false })
  @ApiResponse({ status: 200, description: 'List of wards' })
  @Get()
  findAll(@Query('districtId') districtId?: string) {
    return this.wardsService.findAll(districtId);
  }

  @ApiOperation({ summary: 'Get a ward by ID' })
  @ApiParam({ name: 'id', description: 'Ward ID' })
  @ApiResponse({ status: 200, description: 'Ward found' })
  @ApiResponse({ status: 404, description: 'Ward not found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wardsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a ward' })
  @ApiParam({ name: 'id', description: 'Ward ID' })
  @ApiResponse({ status: 200, description: 'Ward updated successfully' })
  @ApiResponse({ status: 404, description: 'Ward not found' })
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  update(@Param('id') id: string, @Body() updateWardDto: UpdateWardDto) {
    return this.wardsService.update(id, updateWardDto);
  }

  @ApiOperation({ summary: 'Delete a ward' })
  @ApiParam({ name: 'id', description: 'Ward ID' })
  @ApiResponse({ status: 200, description: 'Ward deleted successfully' })
  @ApiResponse({ status: 404, description: 'Ward not found' })
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  remove(@Param('id') id: string) {
    return this.wardsService.remove(id);
  }
}

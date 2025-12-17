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
  ApiBody,
} from '@nestjs/swagger';
import { TrafficsService } from './traffics.service';
import { CreateTrafficDto } from './dto/create-traffic.dto';
import { UpdateTrafficDto } from './dto/update-traffic.dto';
import { FindTrafficsQueryDto, IntersectsWktDto } from './dto/query.dto';
import { FindByLocationDto } from './dto/find-by-location.dto';
import { BulkUpdateTrafficDto } from './dto/bulk-update-traffic.dto';
import { AdminGuard } from '../../auth/admin.guard';

@ApiTags('traffics')
@Controller('traffics')
export class TrafficsController {
  constructor(private readonly trafficsService: TrafficsService) {}

  @ApiOperation({
    summary: 'Find traffic records intersecting with WKT geometry',
  })
  @ApiBody({ type: IntersectsWktDto, description: 'WKT geometry string' })
  @ApiResponse({
    status: 200,
    description: 'Traffic records intersecting with the geometry',
  })
  @Post('intersects-with')
  findIntersecting(@Body() body: IntersectsWktDto) {
    return this.trafficsService.findTrafficsIntersecting(body.wkt);
  }

  @ApiOperation({ summary: 'Create a new traffic record' })
  @ApiResponse({
    status: 201,
    description: 'Traffic record created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post()
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  create(@Body() createTrafficDto: CreateTrafficDto) {
    return this.trafficsService.create(createTrafficDto);
  }

  @ApiOperation({ summary: 'Get all traffic records' })
  @ApiResponse({ status: 200, description: 'List of traffic records' })
  @Get()
  findAll(@Query() query: FindTrafficsQueryDto) {
    return this.trafficsService.findAll(query);
  }

  @ApiOperation({ summary: 'Find nearest traffic route by location' })
  @ApiResponse({ status: 200, description: 'Nearest traffic route found' })
  @ApiResponse({ status: 404, description: 'No route found nearby' })
  @Get('find-by-location')
  findNearest(@Query() query: FindByLocationDto) {
    return this.trafficsService.findNearest(query.lng, query.lat);
  }

  @ApiOperation({ summary: 'Get a traffic record by ID' })
  @ApiParam({ name: 'id', description: 'Traffic record ID' })
  @ApiResponse({ status: 200, description: 'Traffic record found' })
  @ApiResponse({ status: 404, description: 'Traffic record not found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trafficsService.findOne(id);
  }

  @ApiOperation({ summary: 'Bulk update traffic volumes for simulation' })
  @ApiResponse({
    status: 200,
    description: 'Traffic volumes updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request due to invalid payload',
  })
  @Patch('bulk-update')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  bulkUpdate(@Body() bulkUpdateTrafficDto: BulkUpdateTrafficDto) {
    return this.trafficsService.bulkUpdate(bulkUpdateTrafficDto.updates);
  }

  @ApiOperation({ summary: 'Update a traffic record' })
  @ApiParam({ name: 'id', description: 'Traffic record ID' })
  @ApiResponse({
    status: 200,
    description: 'Traffic record updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Traffic record not found' })
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  update(@Param('id') id: string, @Body() updateTrafficDto: UpdateTrafficDto) {
    return this.trafficsService.update(id, updateTrafficDto);
  }

  @ApiOperation({ summary: 'Delete a traffic record' })
  @ApiParam({ name: 'id', description: 'Traffic record ID' })
  @ApiResponse({
    status: 200,
    description: 'Traffic record deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Traffic record not found' })
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  remove(@Param('id') id: string) {
    return this.trafficsService.remove(id);
  }
}

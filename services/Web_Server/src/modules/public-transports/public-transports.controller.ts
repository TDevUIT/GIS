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
import { PublicTransportsService } from './public-transports.service';
import { JwtAuthGuard } from '../auth/auth.gaurd';
import { AdminGuard } from '../auth/admin.gaurd';
import { CreatePublicTransportDto } from './dto/create-public-transport.dto';
import { UpdatePublicTransportDto } from './dto/update-public-transport.dto';
import { IntersectsWktDto } from './dto/intersects-wkt.dto';
import { FindPublicTransportsQueryDto } from './dto/find-public-transports.query.dto';

@ApiTags('Public Transport')
@Controller('public-transports')
export class PublicTransportsController {
  constructor(
    private readonly publicTransportsService: PublicTransportsService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get all public transport routes',
    description: 'Retrieve public transportation routes with optional filters',
  })
  @ApiQuery({
    name: 'districtId',
    required: false,
    description: 'Filter by district ID',
    example: '1',
  })
  @ApiQuery({
    name: 'mode',
    required: false,
    enum: ['BUS', 'METRO', 'BRT', 'WATERWAY'],
    description: 'Filter by transport mode',
  })
  @ApiResponse({
    status: 200,
    description: 'Public transport routes retrieved successfully',
  })
  findAll(@Query() query: FindPublicTransportsQueryDto) {
    return this.publicTransportsService.findAll(query);
  }

  @Post('intersects-with')
  @ApiOperation({
    summary: 'Find intersecting routes',
    description:
      'Find public transport routes that intersect with a given WKT geometry',
  })
  @ApiResponse({ status: 200, description: 'Intersecting routes found' })
  findIntersecting(@Body() body: IntersectsWktDto) {
    return this.publicTransportsService.findIntersecting(body);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get transport route by ID',
    description: 'Retrieve a specific public transport route by ID',
  })
  @ApiParam({ name: 'id', description: 'Transport route ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Transport route found' })
  @ApiResponse({ status: 404, description: 'Transport route not found' })
  findOne(@Param('id') id: string) {
    return this.publicTransportsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Create transport route',
    description: 'Create a new public transport route (Admin only)',
  })
  @ApiResponse({
    status: 201,
    description: 'Transport route created successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(@Body() createDto: CreatePublicTransportDto) {
    return this.publicTransportsService.create(createDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Update transport route',
    description: 'Update an existing public transport route (Admin only)',
  })
  @ApiParam({ name: 'id', description: 'Transport route ID', example: '1' })
  @ApiResponse({
    status: 200,
    description: 'Transport route updated successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Transport route not found' })
  update(@Param('id') id: string, @Body() updateDto: UpdatePublicTransportDto) {
    return this.publicTransportsService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Delete transport route',
    description: 'Delete a public transport route (Admin only)',
  })
  @ApiParam({ name: 'id', description: 'Transport route ID', example: '1' })
  @ApiResponse({
    status: 200,
    description: 'Transport route deleted successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Transport route not found' })
  remove(@Param('id') id: string) {
    return this.publicTransportsService.remove(id);
  }
}

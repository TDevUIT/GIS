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
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { PublicTransportsService } from './public-transports.service';
import { CreatePublicTransportDto } from './dto/create-public-transport.dto';
import { UpdatePublicTransportDto } from './dto/update-public-transport.dto';
import { FindPublicTransportsQueryDto } from './dto/query.dto';
import { IntersectsWktDto } from '../districts/dto/query-gis.dto';

@ApiTags('public-transports')
@Controller('public-transports')
export class PublicTransportsController {
  constructor(
    private readonly publicTransportsService: PublicTransportsService,
  ) {}

  @ApiOperation({
    summary: 'Find public transports intersecting with WKT geometry',
  })
  @ApiBody({ type: IntersectsWktDto, description: 'WKT geometry string' })
  @ApiResponse({
    status: 200,
    description: 'Public transports intersecting with the geometry',
  })
  @Post('intersects-with')
  findIntersecting(@Body() body: IntersectsWktDto) {
    return this.publicTransportsService.findIntersecting(body.wkt);
  }

  @ApiOperation({ summary: 'Create a new public transport record' })
  @ApiResponse({
    status: 201,
    description: 'Public transport record created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post()
  create(@Body() createPublicTransportDto: CreatePublicTransportDto) {
    return this.publicTransportsService.create(createPublicTransportDto);
  }

  @ApiOperation({ summary: 'Get all public transport records' })
  @ApiResponse({ status: 200, description: 'List of public transport records' })
  @Get()
  findAll(@Query() query: FindPublicTransportsQueryDto) {
    return this.publicTransportsService.findAll(query);
  }

  @ApiOperation({ summary: 'Get a public transport record by ID' })
  @ApiParam({ name: 'id', description: 'Public transport record ID' })
  @ApiResponse({ status: 200, description: 'Public transport record found' })
  @ApiResponse({
    status: 404,
    description: 'Public transport record not found',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.publicTransportsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a public transport record' })
  @ApiParam({ name: 'id', description: 'Public transport record ID' })
  @ApiResponse({
    status: 200,
    description: 'Public transport record updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Public transport record not found',
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePublicTransportDto: UpdatePublicTransportDto,
  ) {
    return this.publicTransportsService.update(id, updatePublicTransportDto);
  }

  @ApiOperation({ summary: 'Delete a public transport record' })
  @ApiParam({ name: 'id', description: 'Public transport record ID' })
  @ApiResponse({
    status: 200,
    description: 'Public transport record deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Public transport record not found',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.publicTransportsService.remove(id);
  }
}

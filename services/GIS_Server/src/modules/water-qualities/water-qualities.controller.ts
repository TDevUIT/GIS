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
  ApiQuery,
} from '@nestjs/swagger';
import { WaterQualitiesService } from './water-qualities.service';
import { CreateWaterQualityDto } from './dto/create-water-quality.dto';
import { UpdateWaterQualityDto } from './dto/update-water-quality.dto';
import { FindWaterQualityQueryDto, FindWithinRadiusDto } from './dto/query.dto';

@ApiTags('water-qualities')
@Controller('water-qualities')
export class WaterQualitiesController {
  constructor(private readonly waterQualitiesService: WaterQualitiesService) {}

  @ApiOperation({ summary: 'Create a new water quality record' })
  @ApiResponse({
    status: 201,
    description: 'Water quality record created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post()
  create(@Body() createWaterQualityDto: CreateWaterQualityDto) {
    return this.waterQualitiesService.create(createWaterQualityDto);
  }

  @ApiOperation({ summary: 'Get all water quality records' })
  @ApiResponse({ status: 200, description: 'List of water quality records' })
  @Get()
  findAll(@Query() query: FindWaterQualityQueryDto) {
    return this.waterQualitiesService.findAll(query);
  }

  @ApiOperation({ summary: 'Find water quality records within radius' })
  @ApiQuery({ name: 'lng', description: 'Longitude' })
  @ApiQuery({ name: 'lat', description: 'Latitude' })
  @ApiQuery({ name: 'radiusInMeters', description: 'Radius in meters' })
  @ApiResponse({
    status: 200,
    description: 'Water quality records within radius',
  })
  @Get('within-radius')
  findWithinRadius(@Query() query: FindWithinRadiusDto) {
    return this.waterQualitiesService.findWithinRadius(
      query.lng,
      query.lat,
      query.radiusInMeters,
    );
  }

  @ApiOperation({ summary: 'Get a water quality record by ID' })
  @ApiParam({ name: 'id', description: 'Water quality record ID' })
  @ApiResponse({ status: 200, description: 'Water quality record found' })
  @ApiResponse({ status: 404, description: 'Water quality record not found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.waterQualitiesService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a water quality record' })
  @ApiParam({ name: 'id', description: 'Water quality record ID' })
  @ApiResponse({
    status: 200,
    description: 'Water quality record updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Water quality record not found' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWaterQualityDto: UpdateWaterQualityDto,
  ) {
    return this.waterQualitiesService.update(id, updateWaterQualityDto);
  }

  @ApiOperation({ summary: 'Delete a water quality record' })
  @ApiParam({ name: 'id', description: 'Water quality record ID' })
  @ApiResponse({
    status: 200,
    description: 'Water quality record deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Water quality record not found' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.waterQualitiesService.remove(id);
  }
}

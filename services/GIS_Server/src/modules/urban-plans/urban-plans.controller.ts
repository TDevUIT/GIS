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
import { UrbanPlansService } from './urban-plans.service';
import { CreateUrbanPlanDto } from './dto/create-urban-plan.dto';
import { UpdateUrbanPlanDto } from './dto/update-urban-plan.dto';
import { FindUrbanPlansQueryDto } from './dto/query.dto';
import { GisPointQueryDto, GisWktBodyDto } from '../../shared/dto/gis-query.dto';
import { AdminGuard } from '../../auth/admin.guard';

@ApiTags('urban-plans')
@Controller('urban-plans')
export class UrbanPlansController {
  constructor(private readonly urbanPlansService: UrbanPlansService) {}

  @ApiOperation({ summary: 'Find urban plan at a specific point' })
  @ApiQuery({ name: 'lng', description: 'Longitude' })
  @ApiQuery({ name: 'lat', description: 'Latitude' })
  @ApiResponse({
    status: 200,
    description: 'Urban plan at the specified point',
  })
  @ApiResponse({ status: 404, description: 'No urban plan found at the point' })
  @Get('at-point')
  findAtPoint(@Query() query: GisPointQueryDto) {
    return this.urbanPlansService.findPlanAtPoint(query.lng, query.lat);
  }

  @ApiOperation({ summary: 'Find urban plans intersecting with WKT geometry' })
  @ApiBody({ type: GisWktBodyDto, description: 'WKT geometry string' })
  @ApiResponse({
    status: 200,
    description: 'Urban plans intersecting with the geometry',
  })
  @Post('intersects-with')
  findIntersecting(@Body() body: GisWktBodyDto) {
    return this.urbanPlansService.findIntersecting(body.wkt);
  }

  @ApiOperation({ summary: 'Create a new urban plan record' })
  @ApiResponse({
    status: 201,
    description: 'Urban plan record created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post()
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  create(@Body() createUrbanPlanDto: CreateUrbanPlanDto) {
    return this.urbanPlansService.create(createUrbanPlanDto);
  }

  @ApiOperation({ summary: 'Get all urban plan records' })
  @ApiResponse({ status: 200, description: 'List of urban plan records' })
  @Get()
  findAll(@Query() query: FindUrbanPlansQueryDto) {
    return this.urbanPlansService.findAll(query);
  }

  @ApiOperation({ summary: 'Get an urban plan record by ID' })
  @ApiParam({ name: 'id', description: 'Urban plan record ID' })
  @ApiResponse({ status: 200, description: 'Urban plan record found' })
  @ApiResponse({ status: 404, description: 'Urban plan record not found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.urbanPlansService.findOne(id);
  }

  @ApiOperation({ summary: 'Update an urban plan record' })
  @ApiParam({ name: 'id', description: 'Urban plan record ID' })
  @ApiResponse({
    status: 200,
    description: 'Urban plan record updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Urban plan record not found' })
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  update(
    @Param('id') id: string,
    @Body() updateUrbanPlanDto: UpdateUrbanPlanDto,
  ) {
    return this.urbanPlansService.update(id, updateUrbanPlanDto);
  }

  @ApiOperation({ summary: 'Delete an urban plan record' })
  @ApiParam({ name: 'id', description: 'Urban plan record ID' })
  @ApiResponse({
    status: 200,
    description: 'Urban plan record deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Urban plan record not found' })
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  remove(@Param('id') id: string) {
    return this.urbanPlansService.remove(id);
  }
}

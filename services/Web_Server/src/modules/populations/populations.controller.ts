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
import { PopulationsService } from './populations.service';
import { JwtAuthGuard } from '../auth/auth.gaurd';
import { AdminGuard } from '../auth/admin.gaurd';
import { CreatePopulationDto } from './dto/create-population.dto';
import { UpdatePopulationDto } from './dto/update-population.dto';

@ApiTags('Populations')
@Controller('populations')
export class PopulationsController {
  constructor(private readonly populationsService: PopulationsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all population records',
    description: 'Retrieve population data with optional filters',
  })
  @ApiQuery({
    name: 'districtId',
    required: false,
    description: 'Filter by district ID',
    example: 'cuid-goes-here',
  })
  @ApiQuery({
    name: 'year',
    required: false,
    description: 'Filter by year',
    example: 2024,
  })
  @ApiResponse({
    status: 200,
    description: 'Population records retrieved successfully',
  })
  findAll(
    @Query('districtId') districtId?: string,
    @Query('year') yearQuery?: string,
  ) {
    let year: number | undefined;
    if (yearQuery !== undefined) {
      const parsedYear = parseInt(yearQuery, 10);
      if (!isNaN(parsedYear)) {
        year = parsedYear;
      }
    }
    return this.populationsService.findAll(districtId, year);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get population by ID',
    description: 'Retrieve a specific population record by ID',
  })
  @ApiParam({ name: 'id', description: 'Population record ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Population record found' })
  @ApiResponse({ status: 404, description: 'Population record not found' })
  findOne(@Param('id') id: string) {
    return this.populationsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Create population record',
    description: 'Create a new population record (Admin only)',
  })
  @ApiResponse({
    status: 201,
    description: 'Population record created successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(@Body() createDto: CreatePopulationDto) {
    return this.populationsService.create(createDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Update population record',
    description: 'Update an existing population record (Admin only)',
  })
  @ApiParam({ name: 'id', description: 'Population record ID', example: '1' })
  @ApiResponse({
    status: 200,
    description: 'Population record updated successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Population record not found' })
  update(@Param('id') id: string, @Body() updateDto: UpdatePopulationDto) {
    return this.populationsService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Delete population record',
    description: 'Delete a population record (Admin only)',
  })
  @ApiParam({ name: 'id', description: 'Population record ID', example: '1' })
  @ApiResponse({
    status: 200,
    description: 'Population record deleted successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Population record not found' })
  remove(@Param('id') id: string) {
    return this.populationsService.remove(id);
  }
}

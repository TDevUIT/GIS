import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { PopulationsService } from './populations.service';
import { CreatePopulationDto } from './dto/create-population.dto';
import { UpdatePopulationDto } from './dto/update-population.dto';

@ApiTags('populations')
@Controller('populations')
export class PopulationsController {
  constructor(private readonly populationsService: PopulationsService) {}

  @ApiOperation({ summary: 'Create a new population record' })
  @ApiResponse({ status: 201, description: 'Population record created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post()
  create(@Body() createPopulationDto: CreatePopulationDto) {
    return this.populationsService.create(createPopulationDto);
  }

  @ApiOperation({ summary: 'Get all population records' })
  @ApiQuery({ name: 'districtId', description: 'District ID', required: false })
  @ApiQuery({ name: 'year', description: 'Year', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of population records' })
  @Get()
  findAll(
    @Query('districtId') districtId?: string,
    @Query('year', new ParseIntPipe({ optional: true })) year?: number,
  ) {
    return this.populationsService.findAll(districtId, year);
  }

  @ApiOperation({ summary: 'Get a population record by ID' })
  @ApiParam({ name: 'id', description: 'Population record ID' })
  @ApiResponse({ status: 200, description: 'Population record found' })
  @ApiResponse({ status: 404, description: 'Population record not found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.populationsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a population record' })
  @ApiParam({ name: 'id', description: 'Population record ID' })
  @ApiResponse({ status: 200, description: 'Population record updated successfully' })
  @ApiResponse({ status: 404, description: 'Population record not found' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePopulationDto: UpdatePopulationDto,
  ) {
    return this.populationsService.update(id, updatePopulationDto);
  }

  @ApiOperation({ summary: 'Delete a population record' })
  @ApiParam({ name: 'id', description: 'Population record ID' })
  @ApiResponse({ status: 200, description: 'Population record deleted successfully' })
  @ApiResponse({ status: 404, description: 'Population record not found' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.populationsService.remove(id);
  }
}

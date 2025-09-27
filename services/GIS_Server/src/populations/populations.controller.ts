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
  DefaultValuePipe,
} from '@nestjs/common';
import { PopulationsService } from './populations.service';
import { CreatePopulationDto } from './dto/create-population.dto';
import { UpdatePopulationDto } from './dto/update-population.dto';

@Controller('populations')
export class PopulationsController {
  constructor(private readonly populationsService: PopulationsService) {}

  @Post()
  create(@Body() createPopulationDto: CreatePopulationDto) {
    return this.populationsService.create(createPopulationDto);
  }

  @Get()
  findAll(
    @Query('districtId') districtId?: string,
    @Query('year', new DefaultValuePipe(undefined), ParseIntPipe) year?: number,
  ) {
    return this.populationsService.findAll(districtId, year);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.populationsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePopulationDto: UpdatePopulationDto,
  ) {
    return this.populationsService.update(id, updatePopulationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.populationsService.remove(id);
  }
}

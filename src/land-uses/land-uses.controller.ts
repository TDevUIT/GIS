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
import { LandUsesService } from './land-uses.service';
import { CreateLandUseDto } from './dto/create-land-use.dto';
import { UpdateLandUseDto } from './dto/update-land-use.dto';
import { FindLandUsesQueryDto } from './dto/query.dto';
import { GisPointQueryDto, GisWktBodyDto } from '../common/dto/gis-query.dto';

@Controller('land-uses')
export class LandUsesController {
  constructor(private readonly landUsesService: LandUsesService) {}

  @Get('at-point')
  findAtPoint(@Query() query: GisPointQueryDto) {
    return this.landUsesService.findLandUseAtPoint(query.lng, query.lat);
  }

  @Post('intersects-with')
  findIntersecting(@Body() body: GisWktBodyDto) {
    return this.landUsesService.findIntersecting(body.wkt);
  }

  @Post()
  create(@Body() createLandUseDto: CreateLandUseDto) {
    return this.landUsesService.create(createLandUseDto);
  }

  @Get()
  findAll(@Query() query: FindLandUsesQueryDto) {
    return this.landUsesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.landUsesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLandUseDto: UpdateLandUseDto) {
    return this.landUsesService.update(id, updateLandUseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.landUsesService.remove(id);
  }
}

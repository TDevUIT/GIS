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
import { TerrainsService } from './terrains.service';
import { CreateTerrainDto } from './dto/create-terrain.dto';
import { UpdateTerrainDto } from './dto/update-terrain.dto';
import { QueryPointDto, IntersectsWktDto } from './dto/query-gis.dto';

@Controller('terrains')
export class TerrainsController {
  constructor(private readonly terrainsService: TerrainsService) {}

  @Get('at-point')
  findAtPoint(@Query() query: QueryPointDto) {
    return this.terrainsService.findTerrainAtPoint(query.lng, query.lat);
  }

  @Post('intersects-with')
  findIntersecting(@Body() body: IntersectsWktDto) {
    return this.terrainsService.findTerrainsIntersecting(body.wkt);
  }

  @Post()
  create(@Body() createTerrainDto: CreateTerrainDto) {
    return this.terrainsService.create(createTerrainDto);
  }

  @Get()
  findAll(@Query('districtId') districtId?: string) {
    return this.terrainsService.findAll(districtId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.terrainsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTerrainDto: UpdateTerrainDto) {
    return this.terrainsService.update(id, updateTerrainDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.terrainsService.remove(id);
  }
}

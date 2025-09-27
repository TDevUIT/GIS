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
import { WardsService } from './wards.service';
import { CreateWardDto } from './dto/create-ward.dto';
import { UpdateWardDto } from './dto/update-ward.dto';
import { ContainsPointDto, IntersectsWktDto } from './dto/query-gis.dto';

@Controller('wards')
export class WardsController {
  constructor(private readonly wardsService: WardsService) {}

  @Get('contains-point')
  findContainingPoint(@Query() query: ContainsPointDto) {
    return this.wardsService.findWardContainingPoint(query.lng, query.lat);
  }

  @Post('intersects-with')
  findIntersecting(@Body() body: IntersectsWktDto) {
    return this.wardsService.findWardsIntersecting(body.wkt);
  }

  @Post()
  create(@Body() createWardDto: CreateWardDto) {
    return this.wardsService.create(createWardDto);
  }

  @Get()
  findAll(@Query('districtId') districtId?: string) {
    return this.wardsService.findAll(districtId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wardsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWardDto: UpdateWardDto) {
    return this.wardsService.update(id, updateWardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wardsService.remove(id);
  }
}

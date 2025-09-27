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
import { TrafficsService } from './traffics.service';
import { CreateTrafficDto } from './dto/create-traffic.dto';
import { UpdateTrafficDto } from './dto/update-traffic.dto';
import { FindTrafficsQueryDto, IntersectsWktDto } from './dto/query.dto';

@Controller('traffics')
export class TrafficsController {
  constructor(private readonly trafficsService: TrafficsService) {}

  @Post('intersects-with')
  findIntersecting(@Body() body: IntersectsWktDto) {
    return this.trafficsService.findTrafficsIntersecting(body.wkt);
  }

  @Post()
  create(@Body() createTrafficDto: CreateTrafficDto) {
    return this.trafficsService.create(createTrafficDto);
  }

  @Get()
  findAll(@Query() query: FindTrafficsQueryDto) {
    return this.trafficsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trafficsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTrafficDto: UpdateTrafficDto) {
    return this.trafficsService.update(id, updateTrafficDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.trafficsService.remove(id);
  }
}

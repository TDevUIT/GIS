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
import { UrbanPlansService } from './urban-plans.service';
import { CreateUrbanPlanDto } from './dto/create-urban-plan.dto';
import { UpdateUrbanPlanDto } from './dto/update-urban-plan.dto';
import { FindUrbanPlansQueryDto } from './dto/query.dto';
import { GisPointQueryDto, GisWktBodyDto } from '../common/dto/gis-query.dto';

@Controller('urban-plans')
export class UrbanPlansController {
  constructor(private readonly urbanPlansService: UrbanPlansService) {}

  @Get('at-point')
  findAtPoint(@Query() query: GisPointQueryDto) {
    return this.urbanPlansService.findPlanAtPoint(query.lng, query.lat);
  }

  @Post('intersects-with')
  findIntersecting(@Body() body: GisWktBodyDto) {
    return this.urbanPlansService.findIntersecting(body.wkt);
  }

  @Post()
  create(@Body() createUrbanPlanDto: CreateUrbanPlanDto) {
    return this.urbanPlansService.create(createUrbanPlanDto);
  }

  @Get()
  findAll(@Query() query: FindUrbanPlansQueryDto) {
    return this.urbanPlansService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.urbanPlansService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUrbanPlanDto: UpdateUrbanPlanDto,
  ) {
    return this.urbanPlansService.update(id, updateUrbanPlanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.urbanPlansService.remove(id);
  }
}

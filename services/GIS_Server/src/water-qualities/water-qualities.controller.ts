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
import { WaterQualitiesService } from './water-qualities.service';
import { CreateWaterQualityDto } from './dto/create-water-quality.dto';
import { UpdateWaterQualityDto } from './dto/update-water-quality.dto';
import { FindWaterQualityQueryDto, FindWithinRadiusDto } from './dto/query.dto';

@Controller('water-qualities')
export class WaterQualitiesController {
  constructor(private readonly waterQualitiesService: WaterQualitiesService) {}

  @Post()
  create(@Body() createWaterQualityDto: CreateWaterQualityDto) {
    return this.waterQualitiesService.create(createWaterQualityDto);
  }

  @Get()
  findAll(@Query() query: FindWaterQualityQueryDto) {
    return this.waterQualitiesService.findAll(query);
  }

  @Get('within-radius')
  findWithinRadius(@Query() query: FindWithinRadiusDto) {
    return this.waterQualitiesService.findWithinRadius(
      query.lng,
      query.lat,
      query.radiusInMeters,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.waterQualitiesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWaterQualityDto: UpdateWaterQualityDto,
  ) {
    return this.waterQualitiesService.update(id, updateWaterQualityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.waterQualitiesService.remove(id);
  }
}

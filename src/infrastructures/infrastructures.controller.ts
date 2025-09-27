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
import { InfrastructuresService } from './infrastructures.service';
import { CreateInfrastructureDto } from './dto/create-infrastructure.dto';
import { UpdateInfrastructureDto } from './dto/update-infrastructure.dto';
import { FindWithinRadiusDto } from './dto/query-gis.dto';
import { InfraCategory } from '@prisma/client';

@Controller('infrastructures')
export class InfrastructuresController {
  constructor(
    private readonly infrastructuresService: InfrastructuresService,
  ) {}

  @Get('within-radius')
  findWithinRadius(@Query() query: FindWithinRadiusDto) {
    return this.infrastructuresService.findWithinRadius(
      query.lng,
      query.lat,
      query.radiusInMeters,
    );
  }

  @Post()
  create(@Body() createInfrastructureDto: CreateInfrastructureDto) {
    return this.infrastructuresService.create(createInfrastructureDto);
  }

  @Get()
  findAll(
    @Query('districtId') districtId?: string,
    @Query('category') category?: InfraCategory,
  ) {
    return this.infrastructuresService.findAll(districtId, category);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.infrastructuresService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInfrastructureDto: UpdateInfrastructureDto,
  ) {
    return this.infrastructuresService.update(id, updateInfrastructureDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.infrastructuresService.remove(id);
  }
}

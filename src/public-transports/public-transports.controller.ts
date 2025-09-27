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
import { PublicTransportsService } from './public-transports.service';
import { CreatePublicTransportDto } from './dto/create-public-transport.dto';
import { UpdatePublicTransportDto } from './dto/update-public-transport.dto';
import { FindPublicTransportsQueryDto } from './dto/query.dto';
import { IntersectsWktDto } from '../districts/dto/query-gis.dto';

@Controller('public-transports')
export class PublicTransportsController {
  constructor(
    private readonly publicTransportsService: PublicTransportsService,
  ) {}

  @Post('intersects-with')
  findIntersecting(@Body() body: IntersectsWktDto) {
    return this.publicTransportsService.findIntersecting(body.wkt);
  }

  @Post()
  create(@Body() createPublicTransportDto: CreatePublicTransportDto) {
    return this.publicTransportsService.create(createPublicTransportDto);
  }

  @Get()
  findAll(@Query() query: FindPublicTransportsQueryDto) {
    return this.publicTransportsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.publicTransportsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePublicTransportDto: UpdatePublicTransportDto,
  ) {
    return this.publicTransportsService.update(id, updatePublicTransportDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.publicTransportsService.remove(id);
  }
}

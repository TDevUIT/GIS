import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UsePipes,
  Query,
} from '@nestjs/common';
import { DistrictsService } from './districts.service';
import { WardsService } from '../wards/wards.service';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';
import { ContainsPointDto, IntersectsWktDto } from './dto/query-gis.dto';

@Controller('districts')
export class DistrictsController {
  constructor(
    private readonly districtsService: DistrictsService,
    private readonly wardsService: WardsService,
  ) {}

  @Get('contains-point')
  @UsePipes(new ValidationPipe({ transform: true }))
  findContainingPoint(@Query() query: ContainsPointDto) {
    return this.districtsService.findDistrictContainingPoint(
      query.lng,
      query.lat,
    );
  }

  @Post('intersects-with')
  @UsePipes(new ValidationPipe())
  findIntersecting(@Body() body: IntersectsWktDto) {
    return this.districtsService.findDistrictsIntersecting(body.wkt);
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createDistrictDto: CreateDistrictDto) {
    return this.districtsService.create(createDistrictDto);
  }

  @Get()
  findAll() {
    return this.districtsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.districtsService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  update(
    @Param('id') id: string,
    @Body() updateDistrictDto: UpdateDistrictDto,
  ) {
    return this.districtsService.update(id, updateDistrictDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.districtsService.remove(id);
  }

  @Get(':districtId/wards')
  findWardsOfDistrict(@Param('districtId') districtId: string) {
    return this.wardsService.findAll(districtId);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DistrictsService } from './districts.service';
import { JwtAuthGuard } from '../auth/auth.gaurd';
import { AdminGuard } from 'src/auth/admin.gaurd';

@Controller('districts')
export class DistrictsController {
  constructor(private readonly districtsService: DistrictsService) {}

  @Get()
  findAll() {
    return this.districtsService.findAll();
  }

  @Get('contains-point')
  findContainingPoint(@Query('lng') lng: string, @Query('lat') lat: string) {
    return this.districtsService.findContainingPoint(lng, lat);
  }

  @Post('intersects-with')
  findIntersecting(@Body() wktBody: any) {
    return this.districtsService.findIntersecting(wktBody);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.districtsService.findOne(id);
  }

  @Get(':districtId/wards')
  findWardsOfDistrict(@Param('districtId') districtId: string) {
    return this.districtsService.findWardsOfDistrict(districtId);
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  create(@Body() createDto: any) {
    return this.districtsService.create(createDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.districtsService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  remove(@Param('id') id: string) {
    return this.districtsService.remove(id);
  }
}

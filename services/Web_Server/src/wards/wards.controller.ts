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
import { WardsService } from './wards.service';
import { JwtAuthGuard } from '../auth/auth.gaurd';
import { AdminGuard } from '../auth/admin.gaurd';

@Controller('wards')
export class WardsController {
  constructor(private readonly wardsService: WardsService) {}

  @Get()
  findAll(@Query('districtId') districtId?: string) {
    return this.wardsService.findAll(districtId);
  }

  @Get('contains-point')
  findContainingPoint(@Query('lng') lng: string, @Query('lat') lat: string) {
    return this.wardsService.findContainingPoint(lng, lat);
  }

  @Post('intersects-with')
  findIntersecting(@Body() wktBody: any) {
    return this.wardsService.findIntersecting(wktBody);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wardsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  create(@Body() createDto: any) {
    return this.wardsService.create(createDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.wardsService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  remove(@Param('id') id: string) {
    return this.wardsService.remove(id);
  }
}

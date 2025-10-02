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
import { TerrainsService } from './terrains.service';
import { JwtAuthGuard } from '../auth/auth.gaurd';
import { AdminGuard } from '../auth/admin.gaurd';

@Controller('terrains')
export class TerrainsController {
  constructor(private readonly terrainsService: TerrainsService) {}

  @Get()
  findAll(@Query('districtId') districtId?: string) {
    return this.terrainsService.findAll(districtId);
  }

  @Get('at-point')
  findAtPoint(@Query('lng') lng: string, @Query('lat') lat: string) {
    return this.terrainsService.findAtPoint(lng, lat);
  }

  @Post('intersects-with')
  findIntersecting(@Body() wktBody: any) {
    return this.terrainsService.findIntersecting(wktBody);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.terrainsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  create(@Body() createDto: any) {
    return this.terrainsService.create(createDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.terrainsService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  remove(@Param('id') id: string) {
    return this.terrainsService.remove(id);
  }
}

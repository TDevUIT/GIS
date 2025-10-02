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
import { LandUsesService } from './land-uses.service';
import { JwtAuthGuard } from '../auth/auth.gaurd';
import { AdminGuard } from '../auth/admin.gaurd';

class FindLandUsesQuery {
  districtId?: string;
  type?: string;
}

@Controller('land-uses')
export class LandUsesController {
  constructor(private readonly landUsesService: LandUsesService) {}

  @Get()
  findAll(@Query() query: FindLandUsesQuery) {
    return this.landUsesService.findAll(query);
  }

  @Get('at-point')
  findAtPoint(@Query('lng') lng: string, @Query('lat') lat: string) {
    return this.landUsesService.findAtPoint(lng, lat);
  }

  @Post('intersects-with')
  findIntersecting(@Body() wktBody: any) {
    return this.landUsesService.findIntersecting(wktBody);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.landUsesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  create(@Body() createDto: any) {
    return this.landUsesService.create(createDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.landUsesService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  remove(@Param('id') id: string) {
    return this.landUsesService.remove(id);
  }
}

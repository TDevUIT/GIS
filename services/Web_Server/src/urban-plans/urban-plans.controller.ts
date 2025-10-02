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
import { UrbanPlansService } from './urban-plans.service';
import { JwtAuthGuard } from '../auth/auth.gaurd';
import { AdminGuard } from '../auth/admin.gaurd';

class FindUrbanPlansQuery {
  districtId?: string;
  zoningType?: string;
}

@Controller('urban-plans')
export class UrbanPlansController {
  constructor(private readonly urbanPlansService: UrbanPlansService) {}

  @Get()
  findAll(@Query() query: FindUrbanPlansQuery) {
    return this.urbanPlansService.findAll(query);
  }

  @Get('at-point')
  findAtPoint(@Query('lng') lng: string, @Query('lat') lat: string) {
    return this.urbanPlansService.findAtPoint(lng, lat);
  }

  @Post('intersects-with')
  findIntersecting(@Body() wktBody: any) {
    return this.urbanPlansService.findIntersecting(wktBody);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.urbanPlansService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  create(@Body() createDto: any) {
    return this.urbanPlansService.create(createDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.urbanPlansService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  remove(@Param('id') id: string) {
    return this.urbanPlansService.remove(id);
  }
}

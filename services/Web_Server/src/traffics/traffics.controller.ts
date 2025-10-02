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
import { TrafficsService } from './traffics.service';
import { JwtAuthGuard } from '../auth/auth.gaurd';
import { AdminGuard } from '../auth/admin.gaurd';

class FindTrafficsQuery {
  districtId?: string;
  roadName?: string;
}

@Controller('traffics')
export class TrafficsController {
  constructor(private readonly trafficsService: TrafficsService) {}

  @Get()
  findAll(@Query() query: FindTrafficsQuery) {
    return this.trafficsService.findAll(query);
  }

  @Post('intersects-with')
  findIntersecting(@Body() wktBody: any) {
    return this.trafficsService.findIntersecting(wktBody);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trafficsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  create(@Body() createDto: any) {
    return this.trafficsService.create(createDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.trafficsService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  remove(@Param('id') id: string) {
    return this.trafficsService.remove(id);
  }
}

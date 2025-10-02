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
import { PublicTransportsService } from './public-transports.service';
import { JwtAuthGuard } from '../auth/auth.gaurd';
import { AdminGuard } from '../auth/admin.gaurd';

type TransportMode = 'BUS' | 'METRO' | 'BRT' | 'WATERWAY';

class FindPublicTransportsQuery {
  districtId?: string;
  mode?: TransportMode;
}

@Controller('public-transports')
export class PublicTransportsController {
  constructor(
    private readonly publicTransportsService: PublicTransportsService,
  ) {}

  @Get()
  findAll(@Query() query: FindPublicTransportsQuery) {
    return this.publicTransportsService.findAll(query);
  }

  @Post('intersects-with')
  findIntersecting(@Body() wktBody: any) {
    return this.publicTransportsService.findIntersecting(wktBody);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.publicTransportsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  create(@Body() createDto: any) {
    return this.publicTransportsService.create(createDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.publicTransportsService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  remove(@Param('id') id: string) {
    return this.publicTransportsService.remove(id);
  }
}

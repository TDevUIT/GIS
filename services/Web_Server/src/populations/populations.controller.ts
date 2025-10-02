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
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { PopulationsService } from './populations.service';
import { JwtAuthGuard } from '../auth/auth.gaurd';
import { AdminGuard } from '../auth/admin.gaurd';

@Controller('populations')
export class PopulationsController {
  constructor(private readonly populationsService: PopulationsService) {}

  @Get()
  findAll(
    @Query('districtId') districtId?: string,
    @Query('year', new DefaultValuePipe(undefined), ParseIntPipe) year?: number,
  ) {
    return this.populationsService.findAll(districtId, year);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.populationsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  create(@Body() createDto: any) {
    return this.populationsService.create(createDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.populationsService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  remove(@Param('id') id: string) {
    return this.populationsService.remove(id);
  }
}

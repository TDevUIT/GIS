import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AccidentsService } from './accidents.service';
import { JwtAuthGuard } from '../auth/auth.gaurd';
import { AdminGuard } from '../auth/admin.gaurd';

interface UploadedFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
  fieldname: string;
}

@Controller('accidents')
export class AccidentsController {
  constructor(private readonly accidentsService: AccidentsService) {}

  @Get()
  findAll() {
    return this.accidentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accidentsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  create(@Body() createDto: any) {
    return this.accidentsService.create(createDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.accidentsService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  remove(@Param('id') id: string) {
    return this.accidentsService.remove(id);
  }

  @Post('upload')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @UseInterceptors(FilesInterceptor('images', 10))
  uploadImages(@UploadedFiles() files: UploadedFile[]) {
    return this.accidentsService.uploadImages(files);
  }

  @Post(':id/images')
  @UseGuards(JwtAuthGuard, AdminGuard)
  setImages(@Param('id') id: string, @Body() imagesData: any) {
    return this.accidentsService.setImages(id, imagesData);
  }

  @Delete(':id/images/:imageId')
  @UseGuards(JwtAuthGuard, AdminGuard)
  deleteImage(@Param('id') id: string, @Param('imageId') imageId: string) {
    return this.accidentsService.deleteImage(id, imageId);
  }
}

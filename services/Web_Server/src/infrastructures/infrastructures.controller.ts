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
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { InfrastructuresService } from './infrastructures.service';
import { JwtAuthGuard } from '../auth/auth.gaurd';
import { AdminGuard } from '../auth/admin.gaurd';
type InfraCategory =
  | 'SCHOOL'
  | 'HOSPITAL'
  | 'PARK'
  | 'MARKET'
  | 'UTILITY'
  | 'ADMINISTRATIVE'
  | 'OTHER';

interface UploadedFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
  fieldname: string;
}

@Controller('infrastructures')
export class InfrastructuresController {
  constructor(
    private readonly infrastructuresService: InfrastructuresService,
  ) {}

  @Get()
  findAll(
    @Query('districtId') districtId?: string,
    @Query('category') category?: InfraCategory,
  ) {
    return this.infrastructuresService.findAll(districtId, category);
  }

  @Get('within-radius')
  findWithinRadius(
    @Query('lng') lng: string,
    @Query('lat') lat: string,
    @Query('radiusInMeters') radiusInMeters: string,
  ) {
    return this.infrastructuresService.findWithinRadius(
      lng,
      lat,
      radiusInMeters,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.infrastructuresService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  create(@Body() createDto: any) {
    return this.infrastructuresService.create(createDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.infrastructuresService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  remove(@Param('id') id: string) {
    return this.infrastructuresService.remove(id);
  }

  @Post('upload')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @UseInterceptors(FilesInterceptor('images', 10))
  uploadImages(@UploadedFiles() files: UploadedFile[]) {
    return this.infrastructuresService.uploadImages(files);
  }

  @Post(':id/images')
  @UseGuards(JwtAuthGuard, AdminGuard)
  setImages(@Param('id') id: string, @Body() imagesData: any) {
    return this.infrastructuresService.setImages(id, imagesData);
  }

  @Delete(':id/images/:imageId')
  @UseGuards(JwtAuthGuard, AdminGuard)
  deleteImage(@Param('id') id: string, @Param('imageId') imageId: string) {
    return this.infrastructuresService.deleteImage(id, imageId);
  }
}

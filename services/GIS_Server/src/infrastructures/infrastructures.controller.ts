import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { InfrastructuresService } from './infrastructures.service';
import { CreateInfrastructureDto } from './dto/create-infrastructure.dto';
import { UpdateInfrastructureDto } from './dto/update-infrastructure.dto';
import { FindWithinRadiusDto } from './dto/query-gis.dto';
import { InfraCategory } from '@prisma/client';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ManageImagesDto } from './dto/manage-images.dto';

@Controller('infrastructures')
export class InfrastructuresController {
  constructor(
    private readonly infrastructuresService: InfrastructuresService,
  ) {}

  @Get('within-radius')
  findWithinRadius(@Query() query: FindWithinRadiusDto) {
    return this.infrastructuresService.findWithinRadius(
      query.lng,
      query.lat,
      query.radiusInMeters,
    );
  }

  @Post()
  create(@Body() createInfrastructureDto: CreateInfrastructureDto) {
    return this.infrastructuresService.create(createInfrastructureDto);
  }

  @Post('upload')
  @UseInterceptors(FilesInterceptor('images', 10))
  uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
    return this.infrastructuresService.uploadImages(files);
  }

  @Post(':id/images')
  setImages(@Param('id') id: string, @Body() manageImagesDto: ManageImagesDto) {
    return this.infrastructuresService.setImages(id, manageImagesDto.images);
  }

  @Delete(':id/images/:imageId')
  deleteImage(@Param('id') id: string, @Param('imageId') imageId: string) {
    return this.infrastructuresService.deleteImage(id, imageId);
  }

  @Get()
  findAll(
    @Query('districtId') districtId?: string,
    @Query('category') category?: InfraCategory,
  ) {
    return this.infrastructuresService.findAll(districtId, category);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.infrastructuresService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInfrastructureDto: UpdateInfrastructureDto,
  ) {
    return this.infrastructuresService.update(id, updateInfrastructureDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.infrastructuresService.remove(id);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AccidentsService } from './accidents.service';
import { CreateAccidentDto } from './dto/create-accident.dto';
import { UpdateAccidentDto } from './dto/update-accident.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ManageImagesDto } from './dto/manage-images.dto';

@Controller('accidents')
export class AccidentsController {
  constructor(private readonly accidentsService: AccidentsService) {}

  @Post()
  create(@Body() createAccidentDto: CreateAccidentDto) {
    return this.accidentsService.create(createAccidentDto);
  }

  @Get()
  findAll() {
    return this.accidentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accidentsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAccidentDto: UpdateAccidentDto,
  ) {
    return this.accidentsService.update(id, updateAccidentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accidentsService.remove(id);
  }

  @Post('upload')
  @UseInterceptors(FilesInterceptor('images', 10))
  uploadImages(@UploadedFiles() files: Array<Express.Multer.File>) {
    return this.accidentsService.uploadImages(files);
  }

  @Post(':id/images')
  setImages(@Param('id') id: string, @Body() manageImagesDto: ManageImagesDto) {
    return this.accidentsService.setImages(id, manageImagesDto.images);
  }

  @Delete(':id/images/:imageId')
  deleteImage(@Param('id') id: string, @Param('imageId') imageId: string) {
    return this.accidentsService.deleteImage(id, imageId);
  }
}

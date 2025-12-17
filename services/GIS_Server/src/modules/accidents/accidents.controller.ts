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
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { AccidentsService } from './accidents.service';
import { CreateAccidentDto } from './dto/create-accident.dto';
import { UpdateAccidentDto } from './dto/update-accident.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ManageImagesDto } from './dto/manage-images.dto';
import { AdminGuard } from '../../auth/admin.guard';

@ApiTags('accidents')
@Controller('accidents')
export class AccidentsController {
  constructor(private readonly accidentsService: AccidentsService) {}

  @ApiOperation({ summary: 'Create a new accident record' })
  @ApiResponse({
    status: 201,
    description: 'Accident record created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post()
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  create(@Body() createAccidentDto: CreateAccidentDto) {
    return this.accidentsService.create(createAccidentDto);
  }

  @ApiOperation({ summary: 'Get all accident records' })
  @ApiResponse({ status: 200, description: 'List of all accident records' })
  @Get()
  findAll() {
    return this.accidentsService.findAll();
  }

  @ApiOperation({ summary: 'Get an accident record by ID' })
  @ApiParam({ name: 'id', description: 'Accident ID' })
  @ApiResponse({ status: 200, description: 'Accident record found' })
  @ApiResponse({ status: 404, description: 'Accident not found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accidentsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update an accident record' })
  @ApiParam({ name: 'id', description: 'Accident ID' })
  @ApiResponse({
    status: 200,
    description: 'Accident record updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Accident not found' })
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  update(
    @Param('id') id: string,
    @Body() updateAccidentDto: UpdateAccidentDto,
  ) {
    return this.accidentsService.update(id, updateAccidentDto);
  }

  @ApiOperation({ summary: 'Delete an accident record' })
  @ApiParam({ name: 'id', description: 'Accident ID' })
  @ApiResponse({
    status: 200,
    description: 'Accident record deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Accident not found' })
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  remove(@Param('id') id: string) {
    return this.accidentsService.remove(id);
  }

  @ApiOperation({ summary: 'Upload accident images' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Images uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid file format or size' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @Post('upload')
  @UseInterceptors(FilesInterceptor('images', 10))
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  uploadImages(@UploadedFiles() files: Array<Express.Multer.File>) {
    return this.accidentsService.uploadImages(files);
  }

  @ApiOperation({ summary: 'Set images for an accident record' })
  @ApiParam({ name: 'id', description: 'Accident ID' })
  @ApiResponse({ status: 200, description: 'Images set successfully' })
  @ApiResponse({ status: 404, description: 'Accident not found' })
  @Post(':id/images')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  setImages(@Param('id') id: string, @Body() manageImagesDto: ManageImagesDto) {
    return this.accidentsService.setImages(id, manageImagesDto.images);
  }

  @ApiOperation({ summary: 'Delete an image from accident record' })
  @ApiParam({ name: 'id', description: 'Accident ID' })
  @ApiParam({ name: 'imageId', description: 'Image ID' })
  @ApiResponse({ status: 200, description: 'Image deleted successfully' })
  @ApiResponse({ status: 404, description: 'Accident or image not found' })
  @Delete(':id/images/:imageId')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  deleteImage(@Param('id') id: string, @Param('imageId') imageId: string) {
    return this.accidentsService.deleteImage(id, imageId);
  }
}

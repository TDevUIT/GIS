/* eslint-disable @typescript-eslint/no-unsafe-call */
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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
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

@ApiTags('Accidents')
@Controller('accidents')
export class AccidentsController {
  constructor(private readonly accidentsService: AccidentsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all accidents',
    description: 'Retrieve all traffic accident records',
  })
  @ApiResponse({ status: 200, description: 'Accidents retrieved successfully' })
  findAll() {
    return this.accidentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get accident by ID',
    description: 'Retrieve a specific accident record by ID',
  })
  @ApiParam({ name: 'id', description: 'Accident ID', example: '123' })
  @ApiResponse({ status: 200, description: 'Accident found' })
  @ApiResponse({ status: 404, description: 'Accident not found' })
  findOne(@Param('id') id: string) {
    return this.accidentsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Create accident record',
    description: 'Create a new traffic accident record (Admin only)',
  })
  @ApiResponse({ status: 201, description: 'Accident created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  create(@Body() createDto: any) {
    return this.accidentsService.create(createDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Update accident record',
    description: 'Update an existing accident record (Admin only)',
  })
  @ApiParam({ name: 'id', description: 'Accident ID', example: '123' })
  @ApiResponse({ status: 200, description: 'Accident updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  @ApiResponse({ status: 404, description: 'Accident not found' })
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.accidentsService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Delete accident record',
    description: 'Delete an accident record (Admin only)',
  })
  @ApiParam({ name: 'id', description: 'Accident ID', example: '123' })
  @ApiResponse({ status: 200, description: 'Accident deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  @ApiResponse({ status: 404, description: 'Accident not found' })
  remove(@Param('id') id: string) {
    return this.accidentsService.remove(id);
  }

  @Post('upload')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @UseInterceptors(FilesInterceptor('images', 10))
  @ApiBearerAuth('JWT-auth')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Upload accident images',
    description: 'Upload multiple images for accident records (Admin only)',
  })
  @ApiBody({
    description: 'Upload accident images',
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
  @ApiResponse({ status: 201, description: 'Images uploaded successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
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

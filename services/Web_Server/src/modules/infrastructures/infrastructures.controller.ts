/* eslint-disable @typescript-eslint/no-unsafe-call */
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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { InfrastructuresService } from './infrastructures.service';
import { JwtAuthGuard } from '../auth/auth.gaurd';
import { AdminGuard } from '../auth/admin.gaurd';
import { CreateInfrastructureDto } from './dto/create-infrastructure.dto';
import { UpdateInfrastructureDto } from './dto/update-infrastructure.dto';
import { ManageImagesDto } from './dto/manage-images.dto';
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

@ApiTags('Infrastructures')
@Controller('infrastructures')
export class InfrastructuresController {
  constructor(
    private readonly infrastructuresService: InfrastructuresService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get all infrastructures',
    description: 'Retrieve all infrastructure records with optional filters',
  })
  @ApiQuery({
    name: 'districtId',
    required: false,
    description: 'Filter by district ID',
    example: '1',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    enum: [
      'SCHOOL',
      'HOSPITAL',
      'PARK',
      'MARKET',
      'UTILITY',
      'ADMINISTRATIVE',
      'OTHER',
    ],
    description: 'Filter by category',
  })
  @ApiResponse({
    status: 200,
    description: 'Infrastructures retrieved successfully',
  })
  findAll(
    @Query('districtId') districtId?: string,
    @Query('category') category?: InfraCategory,
  ) {
    return this.infrastructuresService.findAll(districtId, category);
  }

  @Get('within-radius')
  @ApiOperation({
    summary: 'Find infrastructures within radius',
    description: 'Find infrastructures within a specified radius from a point',
  })
  @ApiQuery({ name: 'lng', description: 'Longitude', example: '106.6297' })
  @ApiQuery({ name: 'lat', description: 'Latitude', example: '10.8231' })
  @ApiQuery({
    name: 'radiusInMeters',
    description: 'Radius in meters',
    example: '1000',
  })
  @ApiResponse({ status: 200, description: 'Infrastructures found' })
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
  @ApiOperation({
    summary: 'Get infrastructure by ID',
    description: 'Retrieve a specific infrastructure by ID',
  })
  @ApiParam({ name: 'id', description: 'Infrastructure ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Infrastructure found' })
  @ApiResponse({ status: 404, description: 'Infrastructure not found' })
  findOne(@Param('id') id: string) {
    return this.infrastructuresService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Create infrastructure',
    description: 'Create a new infrastructure (Admin only)',
  })
  @ApiResponse({
    status: 201,
    description: 'Infrastructure created successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(@Body() createDto: CreateInfrastructureDto) {
    return this.infrastructuresService.create(createDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Update infrastructure',
    description: 'Update an existing infrastructure (Admin only)',
  })
  @ApiParam({ name: 'id', description: 'Infrastructure ID', example: '1' })
  @ApiResponse({
    status: 200,
    description: 'Infrastructure updated successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Infrastructure not found' })
  update(@Param('id') id: string, @Body() updateDto: UpdateInfrastructureDto) {
    return this.infrastructuresService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Delete infrastructure',
    description: 'Delete an infrastructure (Admin only)',
  })
  @ApiParam({ name: 'id', description: 'Infrastructure ID', example: '1' })
  @ApiResponse({
    status: 200,
    description: 'Infrastructure deleted successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Infrastructure not found' })
  remove(@Param('id') id: string) {
    return this.infrastructuresService.remove(id);
  }

  @Post('upload')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @UseInterceptors(FilesInterceptor('images', 10))
  @ApiBearerAuth('JWT-auth')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Upload infrastructure images',
    description: 'Upload multiple images (Admin only)',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        images: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Images uploaded successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  uploadImages(@UploadedFiles() files: UploadedFile[]) {
    return this.infrastructuresService.uploadImages(files);
  }

  @Post(':id/images')
  @UseGuards(JwtAuthGuard, AdminGuard)
  setImages(@Param('id') id: string, @Body() manageImagesDto: ManageImagesDto) {
    return this.infrastructuresService.setImages(id, manageImagesDto.images);
  }

  @Delete(':id/images/:imageId')
  @UseGuards(JwtAuthGuard, AdminGuard)
  deleteImage(@Param('id') id: string, @Param('imageId') imageId: string) {
    return this.infrastructuresService.deleteImage(id, imageId);
  }
}

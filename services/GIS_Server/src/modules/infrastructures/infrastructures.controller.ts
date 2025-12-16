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
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiQuery,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { InfrastructuresService } from './infrastructures.service';
import { CreateInfrastructureDto } from './dto/create-infrastructure.dto';
import { UpdateInfrastructureDto } from './dto/update-infrastructure.dto';
import { FindWithinRadiusDto } from './dto/query-gis.dto';
import { InfraCategory } from '@prisma/client';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ManageImagesDto } from './dto/manage-images.dto';
import { AdminGuard } from '../../auth/admin.guard';

@ApiTags('infrastructures')
@Controller('infrastructures')
export class InfrastructuresController {
  constructor(
    private readonly infrastructuresService: InfrastructuresService,
  ) {}

  @ApiOperation({ summary: 'Find infrastructures within radius' })
  @ApiQuery({ name: 'lng', description: 'Longitude' })
  @ApiQuery({ name: 'lat', description: 'Latitude' })
  @ApiQuery({ name: 'radiusInMeters', description: 'Radius in meters' })
  @ApiResponse({ status: 200, description: 'Infrastructures within radius' })
  @Get('within-radius')
  findWithinRadius(@Query() query: FindWithinRadiusDto) {
    return this.infrastructuresService.findWithinRadius(
      query.lng,
      query.lat,
      query.radiusInMeters,
    );
  }

  @ApiOperation({ summary: 'Create a new infrastructure record' })
  @ApiResponse({
    status: 201,
    description: 'Infrastructure created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post()
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  create(@Body() createInfrastructureDto: CreateInfrastructureDto) {
    return this.infrastructuresService.create(createInfrastructureDto);
  }

  @ApiOperation({ summary: 'Upload infrastructure images' })
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
  uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
    return this.infrastructuresService.uploadImages(files);
  }

  @ApiOperation({ summary: 'Set images for an infrastructure' })
  @ApiParam({ name: 'id', description: 'Infrastructure ID' })
  @ApiResponse({ status: 200, description: 'Images set successfully' })
  @ApiResponse({ status: 404, description: 'Infrastructure not found' })
  @Post(':id/images')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  setImages(@Param('id') id: string, @Body() manageImagesDto: ManageImagesDto) {
    return this.infrastructuresService.setImages(id, manageImagesDto.images);
  }

  @ApiOperation({ summary: 'Delete an image from infrastructure' })
  @ApiParam({ name: 'id', description: 'Infrastructure ID' })
  @ApiParam({ name: 'imageId', description: 'Image ID' })
  @ApiResponse({ status: 200, description: 'Image deleted successfully' })
  @ApiResponse({
    status: 404,
    description: 'Infrastructure or image not found',
  })
  @Delete(':id/images/:imageId')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  deleteImage(@Param('id') id: string, @Param('imageId') imageId: string) {
    return this.infrastructuresService.deleteImage(id, imageId);
  }

  @ApiOperation({ summary: 'Get all infrastructures' })
  @ApiQuery({ name: 'districtId', description: 'District ID', required: false })
  @ApiQuery({
    name: 'category',
    description: 'Infrastructure category',
    required: false,
    enum: InfraCategory,
  })
  @ApiResponse({ status: 200, description: 'List of infrastructures' })
  @Get()
  findAll(
    @Query('districtId') districtId?: string,
    @Query('category') category?: InfraCategory,
  ) {
    return this.infrastructuresService.findAll(districtId, category);
  }

  @ApiOperation({ summary: 'Get an infrastructure by ID' })
  @ApiParam({ name: 'id', description: 'Infrastructure ID' })
  @ApiResponse({ status: 200, description: 'Infrastructure found' })
  @ApiResponse({ status: 404, description: 'Infrastructure not found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.infrastructuresService.findOne(id);
  }

  @ApiOperation({ summary: 'Update an infrastructure' })
  @ApiParam({ name: 'id', description: 'Infrastructure ID' })
  @ApiResponse({
    status: 200,
    description: 'Infrastructure updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Infrastructure not found' })
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  update(
    @Param('id') id: string,
    @Body() updateInfrastructureDto: UpdateInfrastructureDto,
  ) {
    return this.infrastructuresService.update(id, updateInfrastructureDto);
  }

  @ApiOperation({ summary: 'Delete an infrastructure' })
  @ApiParam({ name: 'id', description: 'Infrastructure ID' })
  @ApiResponse({
    status: 200,
    description: 'Infrastructure deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Infrastructure not found' })
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  remove(@Param('id') id: string) {
    return this.infrastructuresService.remove(id);
  }
}

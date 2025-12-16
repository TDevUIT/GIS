import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UsePipes,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { DistrictsService } from './districts.service';
import { WardsService } from '../wards/wards.service';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';
import { ContainsPointDto, IntersectsWktDto } from './dto/query-gis.dto';
import { AdminGuard } from '../../auth/admin.guard';

@ApiTags('districts')
@Controller('districts')
export class DistrictsController {
  constructor(
    private readonly districtsService: DistrictsService,
    private readonly wardsService: WardsService,
  ) {}

  @ApiOperation({ summary: 'Find district containing a point' })
  @ApiQuery({ name: 'lng', description: 'Longitude' })
  @ApiQuery({ name: 'lat', description: 'Latitude' })
  @ApiResponse({ status: 200, description: 'District containing the point' })
  @ApiResponse({
    status: 404,
    description: 'No district found containing the point',
  })
  @Get('contains-point')
  @UsePipes(new ValidationPipe({ transform: true }))
  findContainingPoint(@Query() query: ContainsPointDto) {
    return this.districtsService.findDistrictContainingPoint(
      query.lng,
      query.lat,
    );
  }

  @ApiOperation({ summary: 'Find districts intersecting with WKT geometry' })
  @ApiBody({ type: IntersectsWktDto, description: 'WKT geometry string' })
  @ApiResponse({
    status: 200,
    description: 'Districts intersecting with the geometry',
  })
  @Post('intersects-with')
  @UsePipes(new ValidationPipe())
  findIntersecting(@Body() body: IntersectsWktDto) {
    return this.districtsService.findDistrictsIntersecting(body.wkt);
  }

  @ApiOperation({ summary: 'Create a new district' })
  @ApiResponse({ status: 201, description: 'District created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  create(@Body() createDistrictDto: CreateDistrictDto) {
    return this.districtsService.create(createDistrictDto);
  }

  @ApiOperation({ summary: 'Get all districts' })
  @ApiResponse({ status: 200, description: 'List of all districts' })
  @Get()
  findAll() {
    return this.districtsService.findAll();
  }

  @ApiOperation({ summary: 'Get a district by ID' })
  @ApiParam({ name: 'id', description: 'District ID' })
  @ApiResponse({ status: 200, description: 'District found' })
  @ApiResponse({ status: 404, description: 'District not found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.districtsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a district' })
  @ApiParam({ name: 'id', description: 'District ID' })
  @ApiResponse({ status: 200, description: 'District updated successfully' })
  @ApiResponse({ status: 404, description: 'District not found' })
  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  update(
    @Param('id') id: string,
    @Body() updateDistrictDto: UpdateDistrictDto,
  ) {
    return this.districtsService.update(id, updateDistrictDto);
  }

  @ApiOperation({ summary: 'Delete a district' })
  @ApiParam({ name: 'id', description: 'District ID' })
  @ApiResponse({ status: 200, description: 'District deleted successfully' })
  @ApiResponse({ status: 404, description: 'District not found' })
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  remove(@Param('id') id: string) {
    return this.districtsService.remove(id);
  }

  @ApiOperation({ summary: 'Get all wards of a district' })
  @ApiParam({ name: 'districtId', description: 'District ID' })
  @ApiResponse({ status: 200, description: 'List of wards in the district' })
  @ApiResponse({ status: 404, description: 'District not found' })
  @Get(':districtId/wards')
  findWardsOfDistrict(@Param('districtId') districtId: string) {
    return this.wardsService.findAll(districtId);
  }
}

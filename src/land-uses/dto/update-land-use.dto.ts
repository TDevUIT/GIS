import { PartialType } from '@nestjs/mapped-types';
import { CreateLandUseDto } from './create-land-use.dto';

export class UpdateLandUseDto extends PartialType(CreateLandUseDto) {}

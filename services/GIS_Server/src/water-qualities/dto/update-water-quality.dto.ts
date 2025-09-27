import { PartialType } from '@nestjs/mapped-types';
import { CreateWaterQualityDto } from './create-water-quality.dto';

export class UpdateWaterQualityDto extends PartialType(CreateWaterQualityDto) {}

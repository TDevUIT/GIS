import { PartialType } from '@nestjs/mapped-types';
import { CreateUrbanPlanDto } from './create-urban-plan.dto';

export class UpdateUrbanPlanDto extends PartialType(CreateUrbanPlanDto) {}

import { PartialType } from '@nestjs/mapped-types';
import { CreateAccidentDto } from './create-accident.dto';

export class UpdateAccidentDto extends PartialType(CreateAccidentDto) {}

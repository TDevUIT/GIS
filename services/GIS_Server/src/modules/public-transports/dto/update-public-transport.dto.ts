import { PartialType } from '@nestjs/mapped-types';
import { CreatePublicTransportDto } from './create-public-transport.dto';

export class UpdatePublicTransportDto extends PartialType(CreatePublicTransportDto) {}

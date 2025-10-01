import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ImageDto } from '../../common/dto/image.dto';

export class ManageImagesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImageDto)
  images: ImageDto[];
}

import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ImageDto {
  @ApiProperty({ example: 'https://res.cloudinary.com/.../image.jpg' })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiProperty({ example: 'cloudinary_public_id' })
  @IsString()
  @IsNotEmpty()
  publicId: string;
}

export class ManageImagesDto {
  @ApiProperty({ type: [ImageDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImageDto)
  images: ImageDto[];
}

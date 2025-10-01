import { Module } from '@nestjs/common';
import { AccidentsService } from './accidents.service';
import { AccidentsController } from './accidents.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [PrismaModule, CloudinaryModule],
  controllers: [AccidentsController],
  providers: [AccidentsService],
  exports: [AccidentsService],
})
export class AccidentsModule {}

import { Module } from '@nestjs/common';
import { AccidentsService } from './accidents.service';
import { AccidentsController } from './accidents.controller';
import { PrismaModule } from '../../infra/prisma/prisma.module';
import { CloudinaryModule } from '../../infra/cloudinary/cloudinary.module';
import { AccidentsRepository } from './accidents.repository';

@Module({
  imports: [PrismaModule, CloudinaryModule],
  controllers: [AccidentsController],
  providers: [AccidentsService, AccidentsRepository],
  exports: [AccidentsService],
})
export class AccidentsModule {}

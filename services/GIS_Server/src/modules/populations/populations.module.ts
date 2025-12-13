import { Module } from '@nestjs/common';
import { PopulationsService } from './populations.service';
import { PopulationsController } from './populations.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PopulationsController],
  providers: [PopulationsService],
  exports: [PopulationsService],
})
export class PopulationsModule {}

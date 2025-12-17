import { Module } from '@nestjs/common';
import { PopulationsService } from './populations.service';
import { PopulationsController } from './populations.controller';
import { PrismaModule } from '../../infra/prisma/prisma.module';
import { PopulationsRepository } from './populations.repository';

@Module({
  imports: [PrismaModule],
  controllers: [PopulationsController],
  providers: [PopulationsService, PopulationsRepository],
  exports: [PopulationsService],
})
export class PopulationsModule {}

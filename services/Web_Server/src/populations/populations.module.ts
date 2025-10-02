import { Module } from '@nestjs/common';
import { PopulationsService } from './populations.service';
import { PopulationsController } from './populations.controller';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [HttpModule, PrismaModule],
  controllers: [PopulationsController],
  providers: [PopulationsService],
})
export class PopulationsModule {}

import { Module } from '@nestjs/common';
import { AccidentsService } from './accidents.service';
import { AccidentsController } from './accidents.controller';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [HttpModule, PrismaModule],
  controllers: [AccidentsController],
  providers: [AccidentsService],
})
export class AccidentsModule {}

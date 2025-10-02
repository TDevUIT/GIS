import { Module } from '@nestjs/common';
import { PublicTransportsService } from './public-transports.service';
import { PublicTransportsController } from './public-transports.controller';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [HttpModule, PrismaModule],
  controllers: [PublicTransportsController],
  providers: [PublicTransportsService],
})
export class PublicTransportsModule {}

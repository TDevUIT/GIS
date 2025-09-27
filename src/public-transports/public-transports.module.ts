import { Module } from '@nestjs/common';
import { PublicTransportsService } from './public-transports.service';
import { PublicTransportsController } from './public-transports.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PublicTransportsController],
  providers: [PublicTransportsService],
  exports: [PublicTransportsService],
})
export class PublicTransportsModule {}

import { Module } from '@nestjs/common';
import { PublicTransportsService } from './public-transports.service';
import { PublicTransportsController } from './public-transports.controller';
import { PrismaModule } from '../../infra/prisma/prisma.module';
import { PublicTransportsRepository } from './public-transports.repository';

@Module({
  imports: [PrismaModule],
  controllers: [PublicTransportsController],
  providers: [PublicTransportsService, PublicTransportsRepository],
  exports: [PublicTransportsService],
})
export class PublicTransportsModule {}

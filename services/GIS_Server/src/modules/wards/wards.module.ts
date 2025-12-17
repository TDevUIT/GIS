import { Module } from '@nestjs/common';
import { WardsService } from './wards.service';
import { WardsController } from './wards.controller';
import { PrismaModule } from '../../infra/prisma/prisma.module';
import { WardsRepository } from './wards.repository';

@Module({
  imports: [PrismaModule],
  controllers: [WardsController],
  providers: [WardsService, WardsRepository],
  exports: [WardsService],
})
export class WardsModule {}

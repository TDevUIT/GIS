import { Module } from '@nestjs/common';
import { DistrictsService } from './districts.service';
import { DistrictsController } from './districts.controller';
import { PrismaModule } from '../../infra/prisma/prisma.module';
import { WardsModule } from '../wards/wards.module';
import { DistrictsRepository } from './districts.repository';

@Module({
  imports: [PrismaModule, WardsModule],
  controllers: [DistrictsController],
  providers: [DistrictsService, DistrictsRepository],
  exports: [DistrictsService],
})
export class DistrictsModule {}

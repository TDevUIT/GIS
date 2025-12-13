import { Module } from '@nestjs/common';
import { DistrictsService } from './districts.service';
import { DistrictsController } from './districts.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { WardsModule } from 'src/wards/wards.module';

@Module({
  imports: [PrismaModule, WardsModule],
  controllers: [DistrictsController],
  providers: [DistrictsService],
  exports: [DistrictsService],
})
export class DistrictsModule {}

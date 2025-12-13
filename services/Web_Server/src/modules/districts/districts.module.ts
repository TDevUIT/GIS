import { Module } from '@nestjs/common';
import { DistrictsController } from './districts.controller';
import { DistrictsService } from './districts.service';
import { PrismaModule } from 'src/infra/prisma/prisma.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [PrismaModule, HttpModule],
  controllers: [DistrictsController],
  providers: [DistrictsService],
  exports: [DistrictsService],
})
export class DistrictsModule {}

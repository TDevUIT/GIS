import { Module } from '@nestjs/common';
import { WardsController } from './wards.controller';
import { WardsService } from './wards.service';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from '../prisma/prisma.module';
@Module({
  imports: [HttpModule, PrismaModule],
  controllers: [WardsController],
  providers: [WardsService],
})
export class WardsModule {}

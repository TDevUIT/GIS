import { Module } from '@nestjs/common';
import { UrbanPlansService } from './urban-plans.service';
import { UrbanPlansController } from './urban-plans.controller';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [HttpModule, PrismaModule],
  controllers: [UrbanPlansController],
  providers: [UrbanPlansService],
})
export class UrbanPlansModule {}

import { Module } from '@nestjs/common';
import { UrbanPlansService } from './urban-plans.service';
import { UrbanPlansController } from './urban-plans.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UrbanPlansController],
  providers: [UrbanPlansService],
  exports: [UrbanPlansService],
})
export class UrbanPlansModule {}

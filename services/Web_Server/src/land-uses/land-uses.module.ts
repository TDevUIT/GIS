import { Module } from '@nestjs/common';
import { LandUsesService } from './land-uses.service';
import { LandUsesController } from './land-uses.controller';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [HttpModule, PrismaModule],
  controllers: [LandUsesController],
  providers: [LandUsesService],
})
export class LandUsesModule {}

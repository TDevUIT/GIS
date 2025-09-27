import { Module } from '@nestjs/common';
import { LandUsesService } from './land-uses.service';
import { LandUsesController } from './land-uses.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LandUsesController],
  providers: [LandUsesService],
  exports: [LandUsesService],
})
export class LandUsesModule {}

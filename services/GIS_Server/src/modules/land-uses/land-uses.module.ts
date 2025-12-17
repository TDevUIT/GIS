import { Module } from '@nestjs/common';
import { LandUsesService } from './land-uses.service';
import { LandUsesController } from './land-uses.controller';
import { PrismaModule } from '../../infra/prisma/prisma.module';
import { LandUsesRepository } from './land-uses.repository';

@Module({
  imports: [PrismaModule],
  controllers: [LandUsesController],
  providers: [LandUsesService, LandUsesRepository],
  exports: [LandUsesService],
})
export class LandUsesModule {}
